#!/usr/bin/env bash
# Confere a integridade do .xcframework antes de embutir no app.
# Cada versão fica num caminho fixo e imutável, com o SHA-256 ao lado.
set -euo pipefail

VERSAO="${1:?uso: ./conferir-xcframework.sh <VERSAO>}"
BASE="https://sdk-ios.legitimuz.com/webview/v${VERSAO}"

curl -fsSLO "${BASE}/LegitimuzWebViewSDK.xcframework.zip"
curl -fsSLO "${BASE}/LegitimuzWebViewSDK.xcframework.zip.sha256"

echo "$(cat LegitimuzWebViewSDK.xcframework.zip.sha256)  LegitimuzWebViewSDK.xcframework.zip" \
  | shasum -a 256 -c
