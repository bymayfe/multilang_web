// 📦 utils/jwt.go
// Amaç: JWT üretme ve doğrulama işlemleri.
// Not: Şifre (password) JWT içine asla eklenmez.
package utils

import (
	"errors"
	"log"
	"os"
	"time"

	"multilang_web/models" // models.User için

	"github.com/golang-jwt/jwt/v5" // JWT token oluşturma & parse etme
	"github.com/joho/godotenv"     // .env dosyasından ortam değişkenlerini yükleme
)

// 🔹 GenerateJWT: Kullanıcı bilgilerini alır, password hariç tüm alanları JWT içine koyar.
func GenerateJWT(user map[string]interface{}) (string, error) {
	// .env dosyasını yükle (hata olsa bile çalışmaya devam etsin diye _ kullandık)
	_ = godotenv.Load(".env")

	// Ortam değişkeninden JWT_SECRET değerini al
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		log.Fatal("JWT_SECRET tanımlı değil.") // Yoksa uygulamayı kapat
	}

	// JWT payload (claims) oluştur
	claims := jwt.MapClaims{}
	for k, v := range user {
		if k != "password" { // Şifreyi asla token'a ekleme
			claims[k] = v
		}
	}

	// Token 3 gün geçerli olacak şekilde expiration ekle
	claims["exp"] = time.Now().Add(72 * time.Hour).Unix()

	// Token'ı HS256 ile imzala
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

// 🔹 ValidateJWT: Token'ı çözümleyip doğrular, claims döndürür.
func ValidateJWT(tokenString string) (jwt.MapClaims, error) {
	_ = godotenv.Load(".env")

	// Ortam değişkeninden secret key'i al
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		log.Fatal("JWT_SECRET tanımlı değil.")
	}

	// Token'ı çözümle
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Token imzalama algoritması HS256 olmalı
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("invalid token type")
		}
		return []byte(secret), nil
	})

	// Token geçersizse hata döndür
	if err != nil || !token.Valid {
		return nil, err
	}

	// Claims'leri map olarak döndür
	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		return claims, nil
	}

	return nil, errors.New("invalid token claims")
}

func CreateClaimsFromUser(user models.User) map[string]interface{} {
	return map[string]interface{}{
		"userID":    user.UserID,
		"email":     user.Email,
		"role":      user.Role,
		"image":     user.Image,
		"username":  user.Username,
		"firstname": user.Firstname,
		"lastname":  user.Lastname,
		"age":       user.Age,
		"createdAt": user.CreatedAt,
		"updatedAt": user.UpdatedAt,
	}
}
