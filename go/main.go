// // pring hello world
// package main
// import "fmt"
// func main() {
// 	fmt.Println("Hello, World!")
// }

// basic port 3001 server hollo world
package main

import (
	"fmt"
	"net/http"
)
func helloHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Hello, World!")
}
func main() {
	http.HandleFunc("/", helloHandler)
	fmt.Println("🚀 Server is running on port 3001")
	if err := http.ListenAndServe(":3001", nil); err != nil {
		fmt.Println("Error starting server:", err)
	}
}
// This is a basic HTTP server that listens on port 3001 and responds with "Hello, World!" to any request.

// // main.go
// package main

// import (
// 	"fmt"
// 	"net/http"
// )

// func handler(w http.ResponseWriter, r *http.Request) {
// 	fmt.Fprintf(w, "Hello World")
// }

// func main() {
// 	http.HandleFunc("/", handler)
// 	fmt.Println("🚀 Sunucu çalışıyor: http://localhost:3001")
// 	err := http.ListenAndServe(":3001", nil)
// 	if err != nil {
// 		fmt.Println("Hata oluştu:", err)
// 	}
// }