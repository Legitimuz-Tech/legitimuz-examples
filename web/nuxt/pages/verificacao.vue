<script setup lang="ts">
import type { WebSdkCompleteResult, WebSdkError, WebSdkEvent } from "~/types/legitimuz";

const { data } = await useFetch("/api/verificacoes", { method: "POST" });

const log = ref<string[]>([]);
const push = (text: string) => log.value.push(text);

const containerRef = useLegitimuz({
  sdkUrl: data.value!.entry.url,
  onReady: () => push("ready"),
  onEvent: (event: WebSdkEvent) => push(`event: ${event.type}`),
  // "o fluxo terminou", não "deu certo". O desfecho chega pelo webhook.
  onComplete: (result: WebSdkCompleteResult) => push(`complete: ${result.status}`),
  onCancel: () => push("cancelled"),
  onError: (error: WebSdkError) => push(`error ${error.code}: ${error.user_message}`),
});
</script>

<template>
  <!-- ClientOnly: o widget usa window e a câmera, que só existem no browser. -->
  <ClientOnly>
    <div ref="containerRef" style="height: 640px"></div>
    <pre>{{ log.join("\n") }}</pre>
  </ClientOnly>
</template>
