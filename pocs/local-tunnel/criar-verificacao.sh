#!/usr/bin/env bash
# Cria uma verificação de teste contra a sandbox e imprime a entry.url.
# Requer LEGITIMUZ_API_KEY e LEGITIMUZ_FLOW_ID no ambiente.
set -euo pipefail

: "${LEGITIMUZ_API_KEY:?defina LEGITIMUZ_API_KEY}"
: "${LEGITIMUZ_FLOW_ID:?defina LEGITIMUZ_FLOW_ID}"
CPF="${1:?uso: ./criar-verificacao.sh <CPF_DE_TESTE>}"

curl -sS -X POST https://api.legitimuz.com/public/verifications \
  -H "X-API-Key: $LEGITIMUZ_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"schema_version\": \"1.0\",
    \"ref_id\": \"local-$(date +%s)\",
    \"document\": { \"type\": \"cpf\", \"number\": \"$CPF\" },
    \"flow_public_id\": \"$LEGITIMUZ_FLOW_ID\"
  }"
