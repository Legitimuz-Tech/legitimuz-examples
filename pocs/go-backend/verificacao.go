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

type entrada struct {
	Kind string `json:"kind"`
	URL  string `json:"url,omitempty"`
}

type respostaLegitimuz struct {
	Verification struct {
		PublicID string `json:"public_id"`
	} `json:"verification"`
	Entry entrada `json:"entry"`
}

var cliente = &http.Client{Timeout: 10 * time.Second}

func criarVerificacao(w http.ResponseWriter, r *http.Request) {
	usuario, ok := autenticar(r)
	if !ok {
		http.Error(w, "nao_autenticado", http.StatusUnauthorized)
		return
	}

	// O documento vem do SEU cadastro, nunca do corpo da requisição.
	cadastro := db.CadastroPorUsuario(usuario.ID)

	corpo, _ := json.Marshal(map[string]any{
		"schema_version": "1.0",
		"ref_id":         cadastro.ID,
		"document":       map[string]string{"type": "cpf", "number": cadastro.CPF},
		"flow_public_id": os.Getenv("LEGITIMUZ_FLOW_ID"),
	})

	req, _ := http.NewRequestWithContext(r.Context(), http.MethodPost, endpoint, bytes.NewReader(corpo))
	req.Header.Set("X-API-Key", os.Getenv("LEGITIMUZ_API_KEY"))
	req.Header.Set("Content-Type", "application/json")

	resposta, err := cliente.Do(req)
	if err != nil {
		http.Error(w, "legitimuz_indisponivel", http.StatusBadGateway)
		return
	}
	defer resposta.Body.Close()

	if resposta.StatusCode >= 400 {
		http.Error(w, fmt.Sprintf("legitimuz_%d", resposta.StatusCode), http.StatusBadGateway)
		return
	}

	var dados respostaLegitimuz
	if err := json.NewDecoder(resposta.Body).Decode(&dados); err != nil {
		http.Error(w, "resposta_invalida", http.StatusBadGateway)
		return
	}

	db.Vincular(cadastro.ID, dados.Verification.PublicID)

	// Só a entry volta ao cliente.
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{"entry": dados.Entry})
}
