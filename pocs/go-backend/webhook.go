package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"
)

const toleranciaSegundos = 300

func assinaturaValida(corpoCru []byte, header, segredo string) bool {
	partes := map[string]string{}
	for _, parte := range strings.Split(header, ",") {
		if chave, valor, ok := strings.Cut(parte, "="); ok {
			partes[chave] = valor
		}
	}

	ts, err := strconv.ParseInt(partes["t"], 10, 64)
	if err != nil || partes["v1"] == "" {
		return false
	}

	if d := time.Now().Unix() - ts; d > toleranciaSegundos || d < -toleranciaSegundos {
		return false
	}

	mac := hmac.New(sha256.New, []byte(segredo))
	fmt.Fprintf(mac, "%d.", ts)
	mac.Write(corpoCru)

	return hmac.Equal([]byte(hex.EncodeToString(mac.Sum(nil))), []byte(partes["v1"]))
}

func receberWebhook(w http.ResponseWriter, r *http.Request) {
	// Lê os bytes originais. Um json.NewDecoder(r.Body) aqui consumiria o corpo antes
	// da conferência. O LimitReader não é opcional: sem teto, um corpo grande num
	// endpoint público vira consumo de memória sem limite.
	corpoCru, err := io.ReadAll(io.LimitReader(r.Body, 1<<20))
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if !assinaturaValida(corpoCru, r.Header.Get("X-Legitimuz-Signature"), os.Getenv("LEGITIMUZ_WEBHOOK_SECRET")) {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	if db.RegistrarSeInedita(r.Header.Get("X-Legitimuz-Delivery")) {
		fila.Publicar(corpoCru)
	}

	w.WriteHeader(http.StatusOK)
}
