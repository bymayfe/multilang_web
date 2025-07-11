// 📦 Bu dosya middleware paketini tanımlar.
// Amaç: Gelen HTTP isteklerindeki Authorization header'ını kontrol edip token doğruluğunu teyit etmek.
package middleware

import (
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

// 🧪 Gizli anahtar — gerçek projede ortam değişkeni (.env) ile kullanman önerilir!
var jwtKey = []byte("super-secret-key")

// 🛡️ AuthMiddleware: Korunan endpoint'lere gelen istekleri kontrol eden middleware
// İşlev: Authorization header içindeki JWT token'ı çözümleyip doğrular.
func AuthMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // 🚪 Authorization header'ı alıyoruz (örnek: "Bearer <token>")
        authHeader := r.Header.Get("Authorization")

        if authHeader == "" {
            http.Error(w, "Authorization header eksik", http.StatusUnauthorized)
            return
        }

        // 🧹 "Bearer <token>" yapısından sadece token'ı ayıklıyoruz
        parts := strings.Split(authHeader, " ")
        if len(parts) != 2 || parts[0] != "Bearer" {
            http.Error(w, "Authorization formatı hatalı", http.StatusUnauthorized)
            return
        }
        tokenString := parts[1]

        // 🧾 Token'ı parse ediyoruz, doğruluğunu kontrol ediyoruz
        token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
            // 🔒 Signing method kontrolü (HS256 olmalı)
            if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
                return nil, http.ErrAbortHandler
            }
            return jwtKey, nil
        })

        if err != nil || !token.Valid {
            http.Error(w, "Geçersiz token", http.StatusUnauthorized)
            return
        }

        // ✅ Token geçerliyse, isteği bir sonraki handler'a yönlendiriyoruz
        next.ServeHTTP(w, r)
    })
}