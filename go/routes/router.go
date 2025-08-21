// 📦 routes/router.go
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
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Preflight request
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// 🔁 Tüm route'ları ayarlayan fonksiyon
func SetupRouter() *mux.Router {
	r := mux.NewRouter()

	// 🔐 Kimlik doğrulama gerektirmeyen endpoint'ler
	r.HandleFunc("/user/signup", SignUpHandler).Methods("POST", "OPTIONS")
	r.HandleFunc("/user/login", LoginHandler).Methods("POST", "OPTIONS")

	// 🛡 Korumalı endpoint'ler (JWT + Session kontrolü gerekli)

	// Session bilgisi almak için
	r.Handle("/user/session",
		middleware.AuthMiddlewareWithCollections(
			userCollection,
			sessionCollection,
			http.HandlerFunc(SessionInfoHandler),
		),
	).Methods("GET", "OPTIONS")

	// Çıkış yapmak için (tek cihaz)
	r.Handle("/user/logout",
		middleware.AuthMiddlewareWithCollections(
			userCollection,
			sessionCollection,
			http.HandlerFunc(LogoutHandler),
		),
	).Methods("POST", "OPTIONS")

	// Tüm cihazlardan çıkış yapmak için
	r.Handle("/user/logout-all",
		middleware.AuthMiddlewareWithCollections(
			userCollection,
			sessionCollection,
			http.HandlerFunc(LogoutAllHandler),
		),
	).Methods("POST", "OPTIONS")

	// Aktif session'ları listelemek için
	r.Handle("/user/sessions",
		middleware.AuthMiddlewareWithCollections(
			userCollection,
			sessionCollection,
			http.HandlerFunc(GetUserSessionsHandler),
		),
	).Methods("GET", "OPTIONS")

	// 🛡 Korumalı örnek endpoint
	r.Handle("/user/protected",
		middleware.AuthMiddlewareWithCollections(
			userCollection,
			sessionCollection,
			http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				// Claims'lerden user bilgilerini al
				claimsMap, ok := r.Context().Value("claims").(map[string]interface{})
				if !ok {
					http.Error(w, "Claims bulunamadı", http.StatusInternalServerError)
					return
				}

				w.Header().Set("Content-Type", "application/json")
				json.NewEncoder(w).Encode(map[string]interface{}{
					"status":   "Authenticated",
					"message":  "Gizli bölgeye hoş geldin kralım 👑",
					"userID":   claimsMap["userID"],
					"email":    claimsMap["email"],
					"username": claimsMap["username"],
					"role":     claimsMap["role"],
				})
			}),
		),
	).Methods("GET", "OPTIONS")

	// Middleware'i ekle
	r.Use(corsMiddleware)

	return r
}
