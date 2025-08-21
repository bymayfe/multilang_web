// 📦 main.go
// 🏁 Bu dosya uygulamanin giriş noktasidir.
// Mongo bağlantisini başlatir ve router üzerinden sunucuyu ayağa kaldirir.
// 🆕 Artık session management sistemi ile çalışır!

package main

import (
	"log"
	"net/http"

	"multilang_web/routes"
)

func main() {
	// 🔌 MongoDB bağlantisini başlat (users + sessions collections)
	routes.InitMongo()

	// 🛣 Router'i kur (yeni logout endpoint'leri dahil)
	router := routes.SetupRouter()

	// 🚀 Sunucuyu çaliştir
	log.Println("🎉 Session-based auth sistemi başlatıldı!")
	log.Println("📍 Yeni endpoint'ler:")
	log.Println("   - POST /user/logout        (tek cihazdan çıkış)")
	log.Println("   - POST /user/logout-all    (tüm cihazlardan çıkış)")
	log.Println("   - GET  /user/sessions      (aktif session'ları listele)")
	log.Println("")
	log.Println("🌐 Sunucu http://localhost:3001 adresinde calisiyor")
	log.Fatal(http.ListenAndServe(":3001", router))
}
