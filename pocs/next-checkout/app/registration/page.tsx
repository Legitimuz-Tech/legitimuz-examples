"use client";

import { useEffect, useRef, useState } from "react";

export default function Registration() {
  const container = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "open" | "waiting">("idle");

  useEffect(() => {
    if (state !== "open" || !container.current) return;

    let handle: { destroy: () => void } | undefined;
    let cancelled = false;

    fetch("/api/verifications", { method: "POST" })
      .then((r) => r.json())
      .then(({ entry }) => {
        if (cancelled || !container.current) return;
        handle = window.Legitimuz.mount({
          sdkUrl: entry.url,
          target: container.current,
          onComplete: () => setState("waiting"),
        });
      });

    return () => {
      cancelled = true;
      handle?.destroy();
    };
  }, [state]);

  if (state === "waiting") {
    // O desfecho vem do webhook. Aqui você só espera.
    return <p>Estamos analisando seus dados. Avisamos assim que terminar.</p>;
  }

  return state === "idle" ? (
    <button onClick={() => setState("open")}>Verificar identidade</button>
  ) : (
    <div ref={container} style={{ minHeight: 600 }} />
  );
}
