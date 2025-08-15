// 📦 routes/handlers.go
package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"multilang_web/models"
	"multilang_web/utils"

	"github.com/joho/godotenv"             // Ortam değişkenlerini yükleme
	"go.mongodb.org/mongo-driver/v2/bson"  // BSON veritipi (Mongo için)
	"go.mongodb.org/mongo-driver/v2/mongo" // MongoDB driver
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

var userCollection *mongo.Collection // Global kullanıcı koleksiyonu

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

	// Kullanıcı koleksiyonunu belirle
	userCollection = client.Database("authdb").Collection("users")

	// Bağlantıyı test et (ping at)
	var result bson.M
	if err := client.Database("admin").RunCommand(context.TODO(), bson.D{{Key: "ping", Value: 1}}).Decode(&result); err != nil {
		panic(err)
	}
	fmt.Println("Mongo bağlantısı sağlandı! ✅")
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
	userMap := utils.CreateClaimsFromUser(user) // veya found
	token, err := utils.GenerateJWT(userMap)
	if err != nil {
		http.Error(w, "Token üretilemedi", http.StatusInternalServerError)
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

	// Token oluştur
	userMap := utils.CreateClaimsFromUser(found) // veya found
	token, err := utils.GenerateJWT(userMap)
	if err != nil {
		http.Error(w, "Token üretilemedi", http.StatusInternalServerError)
		return
	}

	// Yanıt olarak token döndür
	json.NewEncoder(w).Encode(map[string]string{"token": token})
}

// 🔹 SessionInfoHandler: Doğrulanmış token'dan kullanıcı bilgilerini döndürür.
//
//	func SessionInfoHandler(w http.ResponseWriter, r *http.Request) {
//		json.NewEncoder(w).Encode(map[string]interface{}{
//			"userID":    r.Context().Value("userID"),
//			"email":     r.Context().Value("email"),
//			"age":       r.Context().Value("age"),
//			"username":  r.Context().Value("username"),
//			"firstname": r.Context().Value("firstname"),
//			"lastname":  r.Context().Value("lastname"),
//			"createdAt": r.Context().Value("createdAt"),
//			"updatedAt": r.Context().Value("updatedAt"),
//			"message":   "JWT doğrulandı 👑",
//		})
//	}
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
