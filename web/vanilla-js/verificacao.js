// Vem do seu backend, em entry.url. Nunca deixe uma sdkUrl real fixa aqui: ela carrega a credencial
// da verificação no fragmento da URL.
const SDK_URL = "<SUA_SDK_URL>";

const statusEl = document.getElementById("status");

function log(text) {
  statusEl.textContent += `[${new Date().toISOString()}] ${text}\n`;
}

const handle = window.Legitimuz.mount({
  sdkUrl: SDK_URL,
  target: document.getElementById("kyc-widget"),
  onReady: () => log("ready"),
  onEvent: (event) => log(`event: ${event.type} ${JSON.stringify(event.payload ?? {})}`),
  // "o fluxo terminou", não "deu certo": status é "submitted" ou "abandoned"
  onComplete: (result) => log(`complete: ${result.status}`),
  onCancel: (result) => log(`cancelled: ${result.sessionId ?? "sem sessão"}`),
  // user_message pode ser mostrado ao titular; o resto é para o seu log
  onError: (error) => log(`error ${error.code}: ${error.user_message}`),
});

// encerra o iframe e a câmera ao sair da página
window.addEventListener("pagehide", () => handle.destroy());
