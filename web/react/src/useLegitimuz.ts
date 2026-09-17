import { useEffect, useRef } from "react";
import type { LegitimuzWidgetHandle, MountOptions } from "./legitimuz";

export type UseLegitimuzOptions = Omit<MountOptions, "target">;

export function useLegitimuz(options: UseLegitimuzOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<LegitimuzWidgetHandle | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    handleRef.current = window.Legitimuz.mount({
      ...options,
      target: containerRef.current,
    });

    // Roda uma vez por montagem real, incluindo o primeiro passe descartado do StrictMode
    // em dev. Sem isto, a câmera do widget sobrevive ao unmount que deveria encerrá-la.
    return () => handleRef.current?.destroy();
    // sdkUrl apenas: remontar a cada mudança de opção mataria a sessão em andamento
  }, [options.sdkUrl]);

  return containerRef;
}
