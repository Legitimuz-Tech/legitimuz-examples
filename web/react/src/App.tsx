import { useState } from "react";
import { VerificationWidget } from "./VerificationWidget";
import type { WebSdkCompleteResult, WebSdkError, WebSdkEvent } from "./legitimuz";

// Vem do seu backend, em entry.url. Nunca commite um valor real.
const sdkUrl = import.meta.env.VITE_LEGITIMUZ_SDK_URL as string;

export default function App() {
  const [status, setStatus] = useState("montando");
  const [log, setLog] = useState<string[]>([]);
  const append = (line: string) => setLog((entries) => [...entries, line]);

  return (
    <>
      <VerificationWidget
        sdkUrl={sdkUrl}
        onReady={() => setStatus("pronto")}
        onEvent={(event: WebSdkEvent) => append(event.type)}
        // "terminou", não "aprovado": status é "submitted" ou "abandoned"
        onComplete={(result: WebSdkCompleteResult) => setStatus(`fim: ${result.status}`)}
        onCancel={() => setStatus("cancelado")}
        onError={(error: WebSdkError) => setStatus(`erro ${error.code}`)}
      />
      <p>{status}</p>
      <ul>
        {log.map((entry, i) => (
          <li key={i}>{entry}</li>
        ))}
      </ul>
    </>
  );
}
