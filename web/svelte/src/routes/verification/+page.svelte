<script lang="ts">
  import VerificationWidget from "$lib/VerificationWidget.svelte";
  let { data } = $props();
</script>

<VerificationWidget sdkUrl={data.sdkUrl} />
