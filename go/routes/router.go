// 🌐 Tüm HTTP endpoint’leri burada tanımlanır
// Signup ve login işlemleri ile middleware uygulaması yapılır

package routes

import (
	"net/http"

	"multilang_web/middleware"

	"github.com/gorilla/mux"
)

// 🔁 Tüm route’ları ayarlayan fonksiyon
func SetupRouter() *mux.Router {
	r := mux.NewRouter()

	// 🔐 Kullanıcı kayıt ve giriş endpoint'leri
	r.HandleFunc("/signup", SignUpHandler).Methods("POST")
	r.HandleFunc("/login", LoginHandler).Methods("POST")

	// 🛡 Korumalı örnek endpoint (JWT ile erişim kontrolü)
	r.Handle("/protected", middleware.AuthMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Gizli bölgeye hoş geldin kralım 👑"))
	})))

	return r
}