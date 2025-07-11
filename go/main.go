// 🏁 Bu dosya uygulamanin giriş noktasidir.
// Mongo bağlantisini başlatir ve router üzerinden sunucuyu ayağa kaldirir.

package main

import (
	"log"
	"net/http"

	"multilang_web/routes"
)

func main() {
	// 🔌 MongoDB bağlantisini başlat
	routes.InitMongo()

	// 🛣 Router'i kur
	router := routes.SetupRouter()

	// 🚀 Sunucuyu çaliştir
	log.Println("Sunucu http://localhost:3001 adresinde calisiyor")
	log.Fatal(http.ListenAndServe(":3001", router))
}