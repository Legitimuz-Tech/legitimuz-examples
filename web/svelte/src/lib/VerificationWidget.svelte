<script lang="ts">
  import { onMount } from "svelte";
  import type { LegitimuzWidgetHandle, WebSdkEvent } from "$lib/legitimuz";

  let { sdkUrl }: { sdkUrl: string } = $props();

  let container: HTMLDivElement;
  let log = $state<string[]>([]);

  onMount(() => {
    const handle: LegitimuzWidgetHandle = window.Legitimuz.mount({
      sdkUrl,
      target: container,
      onReady: () => log.push("ready"),
      onEvent: (event: WebSdkEvent) => log.push(`event: ${event.type}`),
      // "o fluxo terminou", não "deu certo". O desfecho chega pelo webhook.
      onComplete: (result) => log.push(`complete: ${result.status}`),
      onCancel: () => log.push("cancelled"),
      onError: (error) => log.push(`error ${error.code}`),
    });

    // O retorno do onMount roda no desmonte e encerra a câmera.
    return () => handle.destroy();
  });
</script>

<div bind:this={container} style="height: 640px"></div>
<pre>{log.join("\n")}</pre>
