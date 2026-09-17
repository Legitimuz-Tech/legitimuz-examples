import { createFileRoute } from "@tanstack/react-router";
import { useLegitimuz } from "../hooks/useLegitimuz";
import { criarVerificacao } from "../server/criar-verificacao";

export const Route = createFileRoute("/verificacao")({
  loader: () => criarVerificacao(),
  component: Verificacao,
});

function Verificacao() {
  const { sdkUrl } = Route.useLoaderData();
  const { containerRef, status } = useLegitimuz({ sdkUrl });

  return (
    <>
      <div ref={containerRef} style={{ height: 640 }} />
      <p>{status}</p>
    </>
  );
}
