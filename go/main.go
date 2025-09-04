// 📦 main.go
// 🏁 Bu dosya uygulamanin giriş noktasidir.
// Mongo bağlantisini başlatir ve router üzerinden sunucuyu ayağa kaldirir.
// 🆕 Artık session management sistemi ile çalışır!

package main

import (
	"log"
	"net/http"
	"os"

	"multilang_web/routes"
)

func main() {
	// 🔌 MongoDB bağlantisini başlat
	routes.InitMongo()

	// 🛣 Router'i kur
	router := routes.SetupRouter()

	// 🌐 Port'u .env'den oku, yoksa default 3001 kullan
	port := os.Getenv("PORT")
	if port == "" {
		port = "3001"
	}

	log.Println("🎉 Session-based auth sistemi başlatıldı!")
	log.Println("📍 Yeni endpoint'ler:")
	log.Println("   - POST /user/logout        (tek cihazdan çıkış)")
	log.Println("   - POST /user/logout-all    (tüm cihazlardan çıkış)")
	log.Println("   - GET  /user/sessions      (aktif session'ları listele)")
	log.Println("")
	log.Printf("🌐 Sunucu http://localhost:%s adresinde calisiyor\n", port)

	log.Fatal(http.ListenAndServe(":"+port, router))
	// log.Fatal(http.ListenAndServe(":3001", router))

}
