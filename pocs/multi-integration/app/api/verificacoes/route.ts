import { canalDe } from "@/lib/canais";
import { autenticar, db } from "@/lib/stubs";

export async function POST(request: Request) {
  const usuario = await autenticar(request);
  const cadastro = await db.cadastros.porUsuario(usuario.id);

  // O canal vem do SEU contexto — a origem do cadastro, não um campo que o cliente manda.
  const canal = canalDe(cadastro.canal);

  const resposta = await fetch("https://api.legitimuz.com/public/verifications", {
    method: "POST",
    headers: { "X-API-Key": canal.apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      schema_version: "1.0",
      ref_id: cadastro.id,
      document: { type: "cpf", number: cadastro.cpf },
      flow_public_id: canal.flowId,
    }),
  });

  const { verification, entry } = await resposta.json();
  await db.cadastros.vincular(cadastro.id, verification.public_id, cadastro.canal);

  return Response.json({ entry });
}
