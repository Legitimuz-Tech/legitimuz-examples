import { autenticar, db } from "@/lib/stubs";

export async function POST(request: Request) {
  const usuario = await autenticar(request);
  const cadastro = await db.cadastros.porUsuario(usuario.id);

  // 1. Já decidiu? Não há jornada para abrir.
  if (cadastro.desfecho) {
    return Response.json({ desfecho: cadastro.desfecho }, { status: 409 });
  }

  // 2. Existe e ainda vale? A idempotência devolve a mesma, com o status já avançado.
  const aindaVale = cadastro.expira_em && new Date(cadastro.expira_em) > new Date();
  const refId = aindaVale ? cadastro.ref_id! : `${cadastro.id}-${Date.now()}`;

  const resposta = await fetch("https://api.legitimuz.com/public/verifications", {
    method: "POST",
    headers: {
      "X-API-Key": process.env.LEGITIMUZ_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      schema_version: "1.0",
      ref_id: refId,
      document: { type: "cpf", number: cadastro.cpf },
      flow_public_id: process.env.LEGITIMUZ_FLOW_ID!,
    }),
  });

  const { verification, entry } = await resposta.json();

  // 3. Grave sempre: o ref_id mudou no caso da expiração, e o webhook virá com o novo.
  await db.cadastros.atualizarVerificacao(cadastro.id, {
    ref_id: refId,
    public_id: verification.public_id,
    expira_em: verification.expires_at,
  });

  return Response.json({ entry });
}
