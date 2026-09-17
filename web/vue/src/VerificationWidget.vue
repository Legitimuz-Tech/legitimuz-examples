<script setup lang="ts">
import { ref } from "vue";
import { useLegitimuz } from "./useLegitimuz";
import type { WebSdkCompleteResult, WebSdkError, WebSdkEvent } from "./legitimuz";

const props = defineProps<{ sdkUrl: string }>();

const log = ref<string[]>([]);
const push = (text: string) => log.value.push(text);

const containerRef = useLegitimuz({
  sdkUrl: props.sdkUrl,
  onReady: () => push("ready"),
  onEvent: (event: WebSdkEvent) => push(`event: ${event.type}`),
  // "o fluxo terminou", não "deu certo": status é "submitted" ou "abandoned"
  onComplete: (result: WebSdkCompleteResult) => push(`complete: ${result.status}`),
  onCancel: () => push("cancelled"),
  onError: (error: WebSdkError) => push(`error ${error.code}: ${error.user_message}`),
});
</script>

<template>
  <!-- A altura é obrigatória: o iframe ocupa 100% da altura do container. -->
  <div ref="containerRef" style="height: 640px"></div>
  <pre>{{ log.join("\n") }}</pre>
</template>
