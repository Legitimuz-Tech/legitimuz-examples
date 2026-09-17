import { useEffect, useRef, useState } from "react";
import type { LegitimuzWidgetHandle, MountOptions } from "./legitimuz";

export type UseLegitimuzOptions = Omit<MountOptions, "target">;

/**
 * Mesma disciplina do hook do guia de React, devolvendo também o status para a rota exibir.
 * Uma montagem por sdkUrl, destroy() no cleanup.
 */
export function useLegitimuz(options: UseLegitimuzOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<LegitimuzWidgetHandle | null>(null);
  const [status, setStatus] = useState("montando");

  useEffect(() => {
    if (!containerRef.current) return;

    handleRef.current = window.Legitimuz.mount({
      ...options,
      target: containerRef.current,
      onReady: () => setStatus("pronto"),
      // "terminou", não "aprovado": status é "submitted" ou "abandoned"
      onComplete: (result) => setStatus(`fim: ${result.status}`),
      onCancel: () => setStatus("cancelado"),
      onError: (error) => setStatus(`erro ${error.code}`),
    });

    return () => handleRef.current?.destroy();
    // sdkUrl apenas: remontar a cada mudança de opção mataria a sessão em andamento
  }, [options.sdkUrl]);

  return { containerRef, status };
}
