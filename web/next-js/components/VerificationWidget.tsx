"use client";

// "use client" tem que ser a PRIMEIRA linha do arquivo: um prólogo de diretiva não pode vir
// depois de um comentário. Sem ele, este componente roda na renderização do servidor, onde
// window não existe.

import { useEffect, useRef, useState } from "react";
import type { WebSdkCompleteResult, WebSdkError, WebSdkEvent } from "@/types/legitimuz";

export function VerificationWidget({ sdkUrl }: { sdkUrl: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState("montando");
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const handle = window.Legitimuz.mount({
      sdkUrl,
      target: containerRef.current,
      onReady: () => setStatus("pronto"),
      onEvent: (event: WebSdkEvent) => setLog((l) => [...l, event.type]),
      // "terminou", não "aprovado": status é "submitted" ou "abandoned"
      onComplete: (result: WebSdkCompleteResult) => setStatus(`fim: ${result.status}`),
      onCancel: () => setStatus("cancelado"),
      onError: (error: WebSdkError) => setStatus(`erro ${error.code}`),
    });

    return () => handle.destroy();
    // sdkUrl apenas: remontar a cada mudança de opção mataria a sessão em andamento
  }, [sdkUrl]);

  return (
    <>
      <div ref={containerRef} style={{ height: 640 }} />
      <p>{status}</p>
      <ul>
        {log.map((entry, i) => (
          <li key={i}>{entry}</li>
        ))}
      </ul>
    </>
  );
}
