package main

import (
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("POST /api/verifications", createVerification)
	http.HandleFunc("POST /api/webhooks/legitimuz", receiveWebhook)

	log.Fatal(http.ListenAndServe(":3000", nil))
}
