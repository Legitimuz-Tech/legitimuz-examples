import { onMounted, onUnmounted, ref } from "vue";
import type { LegitimuzWidgetHandle, MountOptions } from "./legitimuz";

export type UseLegitimuzOptions = Omit<MountOptions, "target">;

export function useLegitimuz(options: UseLegitimuzOptions) {
  const containerRef = ref<HTMLDivElement | null>(null);
  let handle: LegitimuzWidgetHandle | null = null;

  onMounted(() => {
    if (!containerRef.value) return;
    handle = window.Legitimuz.mount({ ...options, target: containerRef.value });
  });

  // Encerra o iframe e a stream de câmera junto com o componente.
  onUnmounted(() => handle?.destroy());

  return containerRef;
}
