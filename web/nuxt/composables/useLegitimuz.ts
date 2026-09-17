import type { LegitimuzWidgetHandle, MountOptions } from "~/types/legitimuz";

export type UseLegitimuzOptions = Omit<MountOptions, "target">;

export function useLegitimuz(options: UseLegitimuzOptions) {
  const containerRef = ref<HTMLDivElement | null>(null);
  let handle: LegitimuzWidgetHandle | null = null;

  onMounted(() => {
    if (!containerRef.value) return;
    handle = window.Legitimuz.mount({ ...options, target: containerRef.value });
  });

  onUnmounted(() => handle?.destroy());

  return containerRef;
}
