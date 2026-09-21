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

const toleranceSeconds = 300

func isSignatureValid(rawBody []byte, header, secret string) bool {
	parts := map[string]string{}
	for _, part := range strings.Split(header, ",") {
		if key, value, ok := strings.Cut(part, "="); ok {
			parts[key] = value
		}
	}

	ts, err := strconv.ParseInt(parts["t"], 10, 64)
	if err != nil || parts["v1"] == "" {
		return false
	}

	if d := time.Now().Unix() - ts; d > toleranceSeconds || d < -toleranceSeconds {
		return false
	}

	mac := hmac.New(sha256.New, []byte(secret))
	fmt.Fprintf(mac, "%d.", ts)
	mac.Write(rawBody)

	return hmac.Equal([]byte(hex.EncodeToString(mac.Sum(nil))), []byte(parts["v1"]))
}

func receiveWebhook(w http.ResponseWriter, r *http.Request) {
	// Lê os bytes originais. Um json.NewDecoder(r.Body) aqui consumiria o corpo antes
	// da conferência. O LimitReader não é opcional: sem teto, um corpo grande num
	// endpoint público vira consumo de memória sem limite.
	rawBody, err := io.ReadAll(io.LimitReader(r.Body, 1<<20))
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if !isSignatureValid(rawBody, r.Header.Get("X-Legitimuz-Signature"), os.Getenv("LEGITIMUZ_WEBHOOK_SECRET")) {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	if db.RecordIfNew(r.Header.Get("X-Legitimuz-Delivery")) {
		queue.Publish(rawBody)
	}

	w.WriteHeader(http.StatusOK)
}
