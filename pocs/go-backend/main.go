package main

import (
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("POST /api/verificacoes", criarVerificacao)
	http.HandleFunc("POST /api/webhooks/legitimuz", receberWebhook)

	log.Fatal(http.ListenAndServe(":3000", nil))
}
