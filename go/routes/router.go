package routes

import (
	"encoding/json"
	"net/http"

	"multilang_web/middleware"

	"github.com/gorilla/mux"
)

// CORS middleware
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Frontend origin
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Preflight request
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// 🔁 Tüm route’ları ayarlayan fonksiyon
func SetupRouter() *mux.Router {
	r := mux.NewRouter()

	// 🔐 Kullanıcı kayıt ve giriş endpoint'leri
	r.HandleFunc("/user/signup", SignUpHandler).Methods("POST", "OPTIONS")
	r.HandleFunc("/user/login", LoginHandler).Methods("POST", "OPTIONS")

	// Protected endpoint (JWT kontrolü var)
	r.Handle("/user/session", middleware.AuthMiddlewareWithCollection(userCollection, http.HandlerFunc(SessionInfoHandler))).Methods("GET", "OPTIONS")

	// 🛡 Korumalı örnek endpoint
	r.Handle("/user/protected",
		middleware.AuthMiddlewareWithCollection(
			userCollection, // collection buradan geçiliyor
			http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				w.Header().Set("Content-Type", "application/json")
				json.NewEncoder(w).Encode(map[string]string{
					"status":  "Authenticated",
					"message": "Gizli bölgeye hoş geldin kralım 👑",
				})
			}),
		),
	).Methods("GET", "OPTIONS")

	// Middleware’i ekle
	r.Use(corsMiddleware)

	return r
}
