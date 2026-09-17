"use client";

import { useEffect, useState } from "react";

export function QrDaVerificacao({ qr, expiresAt }: { qr: string; expiresAt: string }) {
  const [status, setStatus] = useState<"aguardando" | "concluida" | "expirada">("aguardando");

  useEffect(() => {
    // O desktop não sabe o que acontece no celular. Quem sabe é o seu backend, pelo webhook —
    // aqui só perguntamos a ele, nunca à Legitimuz.
    const timer = setInterval(async () => {
      const { desfecho } = await fetch("/api/verificacoes/estado").then((r) => r.json());
      if (desfecho) setStatus("concluida");
      if (new Date(expiresAt) < new Date()) setStatus("expirada");
    }, 3_000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  if (status === "expirada") return <p>A jornada expirou. Recomece para gerar um novo QR code.</p>;
  if (status === "concluida") return <p>Recebemos seus dados. Avisamos assim que terminar.</p>;

  return (
    <div>
      <img src={qr} alt="QR code para abrir a verificação no celular" width={320} height={320} />
      <p>Aponte a câmera do seu celular para continuar.</p>
    </div>
  );
}
