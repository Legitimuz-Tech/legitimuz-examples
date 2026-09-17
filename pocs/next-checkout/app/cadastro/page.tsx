"use client";

import { useEffect, useRef, useState } from "react";

export default function Cadastro() {
  const container = useRef<HTMLDivElement>(null);
  const [estado, setEstado] = useState<"inicial" | "aberto" | "aguardando">("inicial");

  useEffect(() => {
    if (estado !== "aberto" || !container.current) return;

    let handle: { destroy: () => void } | undefined;
    let cancelado = false;

    fetch("/api/verificacoes", { method: "POST" })
      .then((r) => r.json())
      .then(({ entry }) => {
        if (cancelado || !container.current) return;
        handle = window.Legitimuz.mount({
          sdkUrl: entry.url,
          target: container.current,
          onComplete: () => setEstado("aguardando"),
        });
      });

    return () => {
      cancelado = true;
      handle?.destroy();
    };
  }, [estado]);

  if (estado === "aguardando") {
    // O desfecho vem do webhook. Aqui você só espera.
    return <p>Estamos analisando seus dados. Avisamos assim que terminar.</p>;
  }

  return estado === "inicial" ? (
    <button onClick={() => setEstado("aberto")}>Verificar identidade</button>
  ) : (
    <div ref={container} style={{ minHeight: 600 }} />
  );
}
