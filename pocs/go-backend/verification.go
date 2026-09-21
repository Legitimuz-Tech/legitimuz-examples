package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"
)

const endpoint = "https://api.legitimuz.com/public/verifications"

type entry struct {
	Kind string `json:"kind"`
	URL  string `json:"url,omitempty"`
}

type legitimuzResponse struct {
	Verification struct {
		PublicID string `json:"public_id"`
	} `json:"verification"`
	Entry entry `json:"entry"`
}

var client = &http.Client{Timeout: 10 * time.Second}

func createVerification(w http.ResponseWriter, r *http.Request) {
	user, ok := authenticate(r)
	if !ok {
		http.Error(w, "not_authenticated", http.StatusUnauthorized)
		return
	}

	// O documento vem do SEU cadastro, nunca do corpo da requisição.
	registration := db.RegistrationByUser(user.ID)

	body, _ := json.Marshal(map[string]any{
		"schema_version": "1.0",
		"ref_id":         registration.ID,
		"document":       map[string]string{"type": "cpf", "number": registration.CPF},
		"flow_public_id": os.Getenv("LEGITIMUZ_FLOW_ID"),
	})

	req, _ := http.NewRequestWithContext(r.Context(), http.MethodPost, endpoint, bytes.NewReader(body))
	req.Header.Set("X-API-Key", os.Getenv("LEGITIMUZ_API_KEY"))
	req.Header.Set("Content-Type", "application/json")

	response, err := client.Do(req)
	if err != nil {
		http.Error(w, "legitimuz_unavailable", http.StatusBadGateway)
		return
	}
	defer response.Body.Close()

	if response.StatusCode >= 400 {
		http.Error(w, fmt.Sprintf("legitimuz_%d", response.StatusCode), http.StatusBadGateway)
		return
	}

	var data legitimuzResponse
	if err := json.NewDecoder(response.Body).Decode(&data); err != nil {
		http.Error(w, "invalid_response", http.StatusBadGateway)
		return
	}

	db.Link(registration.ID, data.Verification.PublicID)

	// Só a entry volta ao cliente.
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{"entry": data.Entry})
}
