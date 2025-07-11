// 🔧 Mongo bağlantisini başlatir ve kullanici kayit/giriş işlemlerini yürütür
// Veriler MongoDB'de "users" koleksiyonuna kaydedilir

package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"multilang_web/models"
	"multilang_web/utils"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

var userCollection *mongo.Collection

// 📡 MongoDB bağlantisini başlatir ve .env dosyasini yükler
func InitMongo() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("'.env' dosyasi yüklenemedi: ", err)
	}

	uri := os.Getenv("MONGODB_URI")
	if uri == "" {
		log.Fatal("MONGODB_URI ortam değişkeni tanimlanmali.")
	}

	opts := options.Client().ApplyURI(uri)
	client, err := mongo.Connect(opts)
	if err != nil {
		panic(err)
	}

	userCollection = client.Database("authdb").Collection("users")

	// 🧪 Mongo bağlantisini ping ile test et
	var result bson.M
	if err := client.Database("admin").RunCommand(context.TODO(), bson.D{
    {Key: "ping", Value: 1},
    {Key: "status", Value: "ok"},
}).Decode(&result); err != nil {
		panic(err)
	}
	fmt.Println("Mongo bağlantisi sağlandi! ✅")
}
func SignUpHandler(w http.ResponseWriter, r *http.Request) {
	var user models.User
	json.NewDecoder(r.Body).Decode(&user)

	// 🧾 Gelen veriyi konsola yaz
	log.Printf("📥 Signup isteği alındı: %+v\n", user)

	hashedPwd, err := utils.HashPassword(user.Password)
	if err != nil {
		http.Error(w, "Şifre hashlenemedi", http.StatusInternalServerError)
		return
	}
	user.Password = hashedPwd

	_, err = userCollection.InsertOne(context.TODO(), user)
	if err != nil {
		http.Error(w, "Kayit başarisiz", http.StatusInternalServerError)
		return
	}

	w.Write([]byte("Kayit başarili ✅"))
}

// 🔓 Kullanici giriş işlemi
func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var creds models.User
	json.NewDecoder(r.Body).Decode(&creds)

	var found models.User
	err := userCollection.FindOne(context.TODO(), bson.M{"email": creds.Email}).Decode(&found)
	if err != nil {
		http.Error(w, "Kullanici bulunamadi", http.StatusUnauthorized)
		return
	}

	if !utils.CheckPasswordHash(creds.Password, found.Password) {
		http.Error(w, "Şifre hatali", http.StatusUnauthorized)
		return
	}

	token, err := utils.GenerateJWT(creds.Email)
	if err != nil {
		http.Error(w, "Token üretilemedi", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"token": token})
}