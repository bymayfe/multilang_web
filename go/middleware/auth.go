// 📦 middleware/auth.go
package middleware

import (
	"context"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"multilang_web/utils"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"

	"github.com/joho/godotenv"
)

// AuthMiddlewareWithCollections artık hem user hem session collection alıyor
func AuthMiddlewareWithCollections(userCollection, sessionCollection *mongo.Collection, next http.Handler) http.Handler {
	_ = godotenv.Load(".env")
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Fatal("JWT_SECRET ortam değişkeni tanımlı değil.")
	}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// 🔹 Nil kontrolü
		if userCollection == nil || sessionCollection == nil {
			http.Error(w, "Database collections not initialized", http.StatusInternalServerError)
			return
		}

		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Authorization header eksik", http.StatusUnauthorized)
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, "Authorization formatı hatalı", http.StatusUnauthorized)
			return
		}
		tokenString := parts[1]

		// 1. JWT'yi validate et
		claims, err := utils.ValidateJWT(tokenString)
		if err != nil {
			http.Error(w, "Geçersiz token", http.StatusUnauthorized)
			return
		}

		// 2. Token'ın aktif session'da olup olmadığını kontrol et
		var session struct {
			UserID    int       `bson:"userID"`
			ExpiresAt time.Time `bson:"expiresAt"`
		}
		err = sessionCollection.FindOne(r.Context(), bson.M{
			"token":     tokenString,
			"expiresAt": bson.M{"$gt": time.Now()}, // Expire olmamış
		}).Decode(&session)

		if err != nil {
			if err == mongo.ErrNoDocuments {
				http.Error(w, "Session bulunamadı veya süresi dolmuş - Tekrar giriş yapın", http.StatusUnauthorized)
			} else {
				http.Error(w, "Session kontrolü başarısız", http.StatusInternalServerError)
			}
			return
		}

		// 3. Kullanıcı hâlâ veritabanında var mı kontrol et
		var userResult bson.M
		err = userCollection.FindOne(r.Context(), bson.M{"userID": session.UserID}).Decode(&userResult)
		if err != nil {
			// User silinmişse session'ı da temizle
			sessionCollection.DeleteOne(r.Context(), bson.M{"token": tokenString})
			http.Error(w, "Kullanıcı bulunamadı (silinmiş olabilir)", http.StatusUnauthorized)
			return
		}

		// 4. JWT claims ile DB user verisini merge et
		mergedClaims := make(map[string]interface{})

		// Önce JWT claims'leri ekle
		for k, v := range claims {
			mergedClaims[k] = v
		}

		// Sonra DB verisi ile güncel bilgileri üstüne yaz
		for k, v := range userResult {
			if k != "password" { // Şifreyi asla context'e ekleme
				mergedClaims[k] = v
			}
		}

		// 5. Session bilgilerini de ekle
		mergedClaims["sessionExpiresAt"] = session.ExpiresAt

		// Context'e ekle ve devam et
		ctx := context.WithValue(r.Context(), "claims", mergedClaims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// 🔹 Backward compatibility için eski fonksiyon (deprecated)
// Not: Bu fonksiyon artık session kontrolü yapmaz, sadece JWT validation yapar
func AuthMiddlewareWithCollection(collection *mongo.Collection, next http.Handler) http.Handler {
	log.Println("⚠️  UYARI: AuthMiddlewareWithCollection deprecated! AuthMiddlewareWithCollections kullanın.")

	_ = godotenv.Load(".env")
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Fatal("JWT_SECRET ortam değişkeni tanımlı değil.")
	}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if collection == nil {
			http.Error(w, "Database collection not initialized", http.StatusInternalServerError)
			return
		}

		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Authorization header eksik", http.StatusUnauthorized)
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, "Authorization formatı hatalı", http.StatusUnauthorized)
			return
		}
		tokenString := parts[1]

		claims, err := utils.ValidateJWT(tokenString)
		if err != nil {
			http.Error(w, "Geçersiz token", http.StatusUnauthorized)
			return
		}

		// Kullanıcı hâlâ veritabanında var mı kontrol et
		var result bson.M
		err = collection.FindOne(r.Context(), bson.M{"userID": claims["userID"]}).Decode(&result)
		if err != nil {
			http.Error(w, "Kullanıcı bulunamadı (silinmiş olabilir)", http.StatusUnauthorized)
			return
		}

		// JWT'den gelen claims ile DB'den gelen user verisini merge et
		mergedClaims := make(map[string]interface{})
		for k, v := range claims {
			mergedClaims[k] = v
		}
		for k, v := range result {
			mergedClaims[k] = v
		}

		ctx := context.WithValue(r.Context(), "claims", mergedClaims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
