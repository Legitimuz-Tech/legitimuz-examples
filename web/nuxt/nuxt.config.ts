export default defineNuxtConfig({
  app: {
    head: {
      // Entra no <head> de todas as páginas e registra window.Legitimuz antes do bundle.
      script: [{ src: "https://sdk.legitimuz.com/v1/websdk.js" }],
    },
  },
  runtimeConfig: {
    // Sem prefixo public: só existe no servidor. Vem de NUXT_LEGITIMUZ_API_KEY.
    legitimuzApiKey: "",
    legitimuzFlowId: "",
  },
});
