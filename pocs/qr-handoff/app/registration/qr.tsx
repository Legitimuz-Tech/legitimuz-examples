"use client";

import { useEffect, useState } from "react";

export function VerificationQr({ qr, expiresAt }: { qr: string; expiresAt: string }) {
  const [status, setStatus] = useState<"waiting" | "done" | "expired">("waiting");

  useEffect(() => {
    // O desktop não sabe o que acontece no celular. Quem sabe é o seu backend, pelo webhook —
    // aqui só perguntamos a ele, nunca à Legitimuz.
    const timer = setInterval(async () => {
      const { outcome } = await fetch("/api/verifications/state").then((r) => r.json());
      if (outcome) setStatus("done");
      if (new Date(expiresAt) < new Date()) setStatus("expired");
    }, 3_000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  if (status === "expired") return <p>A jornada expirou. Recomece para gerar um novo QR code.</p>;
  if (status === "done") return <p>Recebemos seus dados. Avisamos assim que terminar.</p>;

  return (
    <div>
      <img src={qr} alt="QR code para abrir a verificação no celular" width={320} height={320} />
      <p>Aponte a câmera do seu celular para continuar.</p>
    </div>
  );
}
