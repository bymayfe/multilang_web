package middleware

import (
	"context"
	"log"
	"net/http"
	"os"
	"strings"

	"multilang_web/utils"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"

	"github.com/joho/godotenv"
)

// AuthMiddlewareWithCollection artık collection parametresi alıyor
func AuthMiddlewareWithCollection(collection *mongo.Collection, next http.Handler) http.Handler {
	_ = godotenv.Load(".env")
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Fatal("JWT_SECRET ortam değişkeni tanımlı değil.")
	}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// 🔹 Nil kontrolü
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
			mergedClaims[k] = v // DB verisi, token verisinin üstüne yazacak
		}

		// Tek bir context key ile ekle
		ctx := context.WithValue(r.Context(), "claims", mergedClaims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
