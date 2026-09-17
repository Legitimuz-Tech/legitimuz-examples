import { useLoaderData } from "react-router";
import { useLegitimuz } from "~/hooks/useLegitimuz";
import { autenticar, db } from "~/lib/stubs";

// O loader roda só no servidor. A chave nunca chega ao bundle do cliente.
export async function loader({ request }: { request: Request }) {
  const usuario = await autenticar(request);
  const cadastro = await db.cadastro.porUsuario(usuario.id);

  const resposta = await fetch("https://api.legitimuz.com/public/verifications", {
    method: "POST",
    headers: {
      "X-API-Key": process.env.LEGITIMUZ_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      schema_version: "1.0",
      ref_id: cadastro.id,
      document: { type: "cpf", number: cadastro.cpf },
      flow_public_id: process.env.LEGITIMUZ_FLOW_ID!,
    }),
  });

  const { verification, entry } = await resposta.json();
  await db.cadastro.vincular(cadastro.id, verification.public_id);

  // Só a sdkUrl vai para o componente.
  return { sdkUrl: entry.url as string };
}

export default function Verificacao() {
  const { sdkUrl } = useLoaderData<typeof loader>();
  const { containerRef, status } = useLegitimuz({ sdkUrl });

  return (
    <>
      <div ref={containerRef} style={{ height: 640 }} />
      <p>{status}</p>
    </>
  );
}
