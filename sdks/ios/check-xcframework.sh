#!/usr/bin/env bash
# Confere a integridade do .xcframework antes de embutir no app.
# Cada versão fica num caminho fixo e imutável, com o SHA-256 ao lado.
set -euo pipefail

VERSION="${1:?uso: ./check-xcframework.sh <VERSAO>}"
BASE="https://sdk-ios.legitimuz.com/webview/v${VERSION}"

curl -fsSLO "${BASE}/LegitimuzWebViewSDK.xcframework.zip"
curl -fsSLO "${BASE}/LegitimuzWebViewSDK.xcframework.zip.sha256"

echo "$(cat LegitimuzWebViewSDK.xcframework.zip.sha256)  LegitimuzWebViewSDK.xcframework.zip" \
  | shasum -a 256 -c
