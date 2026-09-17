import { createServerFn } from "@tanstack/react-start";
import { autenticar, db } from "../lib/stubs";

// Server functions rodam só no servidor. A chave nunca chega ao bundle do cliente.
export const criarVerificacao = createServerFn({ method: "POST" }).handler(async () => {
  const usuario = await autenticar();
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

  // Só a sdkUrl volta para o cliente.
  return { sdkUrl: entry.url as string };
});
