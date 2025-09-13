// 📦 routes/handlers.go
package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"multilang_web/models"
	"multilang_web/utils"

	"github.com/joho/godotenv"             // Ortam değişkenlerini yükleme
	"go.mongodb.org/mongo-driver/v2/bson"  // BSON veritipi (Mongo için)
	"go.mongodb.org/mongo-driver/v2/mongo" // MongoDB driver
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

var userCollection *mongo.Collection    // Global kullanıcı koleksiyonu
var sessionCollection *mongo.Collection // Global session koleksiyonu

// 🔹 InitMongo: MongoDB bağlantısını başlatır.
func InitMongo() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("'.env' yüklenemedi:", err)
	}

	uri := os.Getenv("MONGODB_URI")
	if uri == "" {
		log.Fatal("MONGODB_URI tanımlanmalı.")
	}

	// Mongo client oluştur
	opts := options.Client().ApplyURI(uri)
	client, err := mongo.Connect(opts)
	if err != nil {
		panic(err)
	}

	// Koleksiyonları belirle
	userCollection = client.Database("authdb").Collection("users")
	sessionCollection = client.Database("authdb").Collection("sessions") // Yeni session collection

	// Session collection için index'ler oluştur
	createSessionIndexes()

	// Expired session'ları temizleyen background job'ı başlat
	go cleanupExpiredSessions()

	// Bağlantıyı test et (ping at)
	var result bson.M
	if err := client.Database("admin").RunCommand(context.TODO(), bson.D{{Key: "ping", Value: 1}}).Decode(&result); err != nil {
		panic(err)
	}
	fmt.Println("Mongo bağlantısı sağlandı! ✅")
	fmt.Println("Session management sistemi aktif! 🔐")
}

// 🔹 createSessionIndexes: Session collection için performance index'leri oluşturur
func createSessionIndexes() {
	ctx := context.Background()

	// Token index (unique)
	tokenIndex := mongo.IndexModel{
		Keys:    bson.D{{Key: "token", Value: 1}},
		Options: options.Index().SetUnique(true),
	}

	// UserID + ExpiresAt index (çoklu cihaz sorguları için)
	userExpiresIndex := mongo.IndexModel{
		Keys: bson.D{
			{Key: "userID", Value: 1},
			{Key: "expiresAt", Value: 1},
		},
	}

	// TTL index (otomatik expired session silme)
	ttlIndex := mongo.IndexModel{
		Keys:    bson.D{{Key: "expiresAt", Value: 1}},
		Options: options.Index().SetExpireAfterSeconds(0),
	}

	sessionCollection.Indexes().CreateMany(ctx, []mongo.IndexModel{
		tokenIndex, userExpiresIndex, ttlIndex,
	})

	log.Println("Session index'leri oluşturuldu ⚡")
}

// 🔹 cleanupExpiredSessions: Her saat expired session'ları temizler
func cleanupExpiredSessions() {
	ticker := time.NewTicker(1 * time.Hour)
	defer ticker.Stop()

	// for {
	// 	select {
	// 	case <-ticker.C:
	// 		ctx := context.Background()
	// 		filter := bson.M{"expiresAt": bson.M{"$lt": time.Now()}}

	// 		result, err := sessionCollection.DeleteMany(ctx, filter)
	// 		if err == nil && result.DeletedCount > 0 {
	// 			log.Printf("🧹 %d expired session temizlendi", result.DeletedCount)
	// 		}
	// 	}
	// }
	for range ticker.C {
		ctx := context.Background()
		filter := bson.M{"expiresAt": bson.M{"$lt": time.Now()}}

		result, err := sessionCollection.DeleteMany(ctx, filter)
		if err == nil && result.DeletedCount > 0 {
			log.Printf("🧹 %d expired session temizlendi", result.DeletedCount)
		}
	}
}

// 🔹 getClientIP: Request'ten client IP adresini alır
func getClientIP(r *http.Request) string {
	// X-Forwarded-For header'ından IP al (proxy arkasındaysa)
	xff := r.Header.Get("X-Forwarded-For")
	if xff != "" {
		return strings.Split(xff, ",")[0]
	}

	// X-Real-IP header'ından al
	xri := r.Header.Get("X-Real-IP")
	if xri != "" {
		return xri
	}

	// Direct connection IP
	return strings.Split(r.RemoteAddr, ":")[0]
}

// 🔹 detectDeviceType: User-Agent'tan cihaz tipini algılar
func detectDeviceType(userAgent string) string {
	ua := strings.ToLower(userAgent)

	if strings.Contains(ua, "mobile") || strings.Contains(ua, "android") || strings.Contains(ua, "iphone") {
		return "mobile"
	}
	if strings.Contains(ua, "tablet") || strings.Contains(ua, "ipad") {
		return "tablet"
	}
	return "desktop"
}

// 🔹 SignUpHandler: Yeni kullanıcı kaydı yapar.
func SignUpHandler(w http.ResponseWriter, r *http.Request) {
	var user models.User
	json.NewDecoder(r.Body).Decode(&user)

	// Email daha önce kayıtlı mı kontrol et
	var existing models.User
	if err := userCollection.FindOne(context.TODO(), bson.M{"email": user.Email}).Decode(&existing); err == nil {
		http.Error(w, "Bu email zaten kayıtlı", http.StatusConflict)
		return
	}

	// Şifreyi hashle
	hashedPwd, err := utils.HashPassword(user.Password)
	if err != nil {
		http.Error(w, "Şifre hashlenemedi", http.StatusInternalServerError)
		return
	}
	user.Password = hashedPwd

	// Yeni UserID üret
	userID, err := utils.GetNextUserID(userCollection)
	if err != nil {
		http.Error(w, "UserID üretilemedi", http.StatusInternalServerError)
		return
	}
	user.UserID = userID

	// Tarihleri ayarla
	user.CreatedAt = time.Now().Format("2006-01-02 15:04:05")
	user.UpdatedAt = user.CreatedAt

	// ROL ekle
	user.Role = "MEMBER"

	// Veritabanına ekle
	if _, err := userCollection.InsertOne(context.TODO(), user); err != nil {
		http.Error(w, "Kayıt başarısız", http.StatusInternalServerError)
		return
	}

	// Token oluştur
	userMap := utils.CreateClaimsFromUser(user)
	token, err := utils.GenerateJWT(userMap)
	if err != nil {
		http.Error(w, "Token üretilemedi", http.StatusInternalServerError)
		return
	}

	// Session oluştur ve kaydet
	session := models.Session{
		UserID:     user.UserID,
		Token:      token,
		ExpiresAt:  time.Now().Add(72 * time.Hour), // JWT ile aynı süre
		CreatedAt:  time.Now(),
		IPAddress:  getClientIP(r),
		UserAgent:  r.UserAgent(),
		DeviceType: detectDeviceType(r.UserAgent()),
	}

	if _, err := sessionCollection.InsertOne(context.TODO(), session); err != nil {
		http.Error(w, "Session oluşturulamadı", http.StatusInternalServerError)
		return
	}

	// Yanıt döndür
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Kayıt başarılı ✅",
		"token":   token,
	})
}

// 🔹 LoginHandler: Kullanıcı girişini yapar.
func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var creds models.User
	json.NewDecoder(r.Body).Decode(&creds)

	// Kullanıcıyı email ile bul
	var found models.User
	if err := userCollection.FindOne(context.TODO(), bson.M{"email": creds.Email}).Decode(&found); err != nil {
		http.Error(w, "Kullanıcı bulunamadı", http.StatusUnauthorized)
		return
	}

	// Şifre kontrolü yap
	if !utils.CheckPasswordHash(creds.Password, found.Password) {
		http.Error(w, "Şifre hatalı", http.StatusUnauthorized)
		return
	}

	// 🔹 YENİ: Bu kullanıcının süresi dolmuş session'larını temizle
	expiredFilter := bson.M{
		"userID":    found.UserID,
		"expiresAt": bson.M{"$lt": time.Now()},
	}
	expiredResult, err := sessionCollection.DeleteMany(context.TODO(), expiredFilter)
	if err == nil && expiredResult.DeletedCount > 0 {
		log.Printf("User %s için %d süresi dolmuş session temizlendi", found.Email, expiredResult.DeletedCount)
	}

	// 🔹 OPSIYONEL: Tek cihaz login istiyorsan bu kısmı aç
	// Mevcut tüm session'ları sil (tek cihaz login için)
	/*
		sessionFilter := bson.M{"userID": found.UserID}
		result, _ := sessionCollection.DeleteMany(context.TODO(), sessionFilter)
		if result.DeletedCount > 0 {
			log.Printf("User %s için %d mevcut session sonlandırıldı", found.Email, result.DeletedCount)
		}
	*/

	// Token oluştur
	userMap := utils.CreateClaimsFromUser(found)
	token, err := utils.GenerateJWT(userMap)
	if err != nil {
		http.Error(w, "Token üretilemedi", http.StatusInternalServerError)
		return
	}

	// Yeni session oluştur ve kaydet
	session := models.Session{
		UserID:     found.UserID,
		Token:      token,
		ExpiresAt:  time.Now().Add(72 * time.Hour), // JWT ile aynı süre
		CreatedAt:  time.Now(),
		IPAddress:  getClientIP(r),
		UserAgent:  r.UserAgent(),
		DeviceType: detectDeviceType(r.UserAgent()),
	}

	if _, err := sessionCollection.InsertOne(context.TODO(), session); err != nil {
		http.Error(w, "Session oluşturulamadı", http.StatusInternalServerError)
		return
	}

	// Yanıt olarak token döndür
	json.NewEncoder(w).Encode(map[string]string{
		"token":   token,
		"message": "Giriş başarılı 🎉",
	})
}

// 🔹 LogoutHandler: Kullanıcıyı çıkış yapar (session'ı siler).
func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	// Token'ı header'dan al
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		http.Error(w, "Authorization header eksik", http.StatusBadRequest)
		return
	}

	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		http.Error(w, "Authorization formatı hatalı", http.StatusBadRequest)
		return
	}
	tokenString := parts[1]

	// Session'ı MongoDB'den sil
	filter := bson.M{"token": tokenString}
	result, err := sessionCollection.DeleteOne(context.TODO(), filter)

	if err != nil {
		http.Error(w, "Çıkış işlemi başarısız", http.StatusInternalServerError)
		return
	}

	if result.DeletedCount == 0 {
		http.Error(w, "Session bulunamadı (zaten çıkış yapmış olabilirsin)", http.StatusNotFound)
		return
	}

	// Başarılı yanıt
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Başarıyla çıkış yapıldı 👋",
	})
}

// 🔹 LogoutAllHandler: Kullanıcıyı tüm cihazlardan çıkış yapar.
func LogoutAllHandler(w http.ResponseWriter, r *http.Request) {
	// Claims'lerden userID al (middleware'den geliyor)
	claimsMap, ok := r.Context().Value("claims").(map[string]interface{})
	if !ok || claimsMap == nil {
		http.Error(w, "Claims bulunamadı", http.StatusInternalServerError)
		return
	}
	// log.Println("Claims:", claimsMap)

	var userID int
	switch v := claimsMap["userID"].(type) {
	case float64:
		userID = int(v)
	case int:
		userID = v
	case int32:
		userID = int(v)
	case int64:
		userID = int(v)
	default:
		http.Error(w, "UserID bulunamadı", http.StatusInternalServerError)
		return
	}

	// Bu user'ın tüm session'larını sil
	filter := bson.M{"userID": userID}
	result, err := sessionCollection.DeleteMany(context.TODO(), filter)
	if err != nil {
		http.Error(w, "Tüm cihazlardan çıkış başarısız", http.StatusInternalServerError)
		return
	}

	// Başarılı yanıt
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Tüm cihazlardan çıkış yapıldı 🔥",
		"count":   result.DeletedCount,
	})
}

// 🔹 GetUserSessionsHandler: Kullanıcının aktif session'larını listeler.
func GetUserSessionsHandler(w http.ResponseWriter, r *http.Request) {
	// Claims'lerden userID al
	claimsMap, ok := r.Context().Value("claims").(map[string]interface{})
	if !ok || claimsMap == nil {
		http.Error(w, "Claims bulunamadı", http.StatusInternalServerError)
		return
	}

	userID, ok := claimsMap["userID"].(int)
	if !ok {
		http.Error(w, "UserID bulunamadı", http.StatusInternalServerError)
		return
	}

	// Aktif session'ları bul
	filter := bson.M{
		"userID":    userID,
		"expiresAt": bson.M{"$gt": time.Now()}, // Expire olmamış
	}

	cursor, err := sessionCollection.Find(context.TODO(), filter)
	if err != nil {
		http.Error(w, "Session'lar alınamadı", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.TODO())

	var sessions []models.Session
	if err := cursor.All(context.TODO(), &sessions); err != nil {
		http.Error(w, "Session'lar parse edilemedi", http.StatusInternalServerError)
		return
	}

	// Token'ları kısalt (güvenlik için)
	for i := range sessions {
		if len(sessions[i].Token) > 20 {
			sessions[i].Token = sessions[i].Token[:20] + "..."
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"sessions": sessions,
		"count":    len(sessions),
	})
}

// 🔹 SessionInfoHandler: Doğrulanmış token'dan kullanıcı bilgilerini döndürür.
func SessionInfoHandler(w http.ResponseWriter, r *http.Request) {
	claimsMap, ok := r.Context().Value("claims").(map[string]interface{})
	if !ok || claimsMap == nil {
		http.Error(w, "Claims bulunamadı", http.StatusInternalServerError)
		return
	}

	// İstersen buraya ek bir message ekleyebilirsin
	claimsMap["message"] = "JWT doğrulandı 👑"

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(claimsMap)
}
