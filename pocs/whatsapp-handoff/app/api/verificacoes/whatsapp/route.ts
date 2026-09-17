import { randomBytes } from "node:crypto";
import { autenticar, db } from "@/lib/stubs";
import { enviarTemplate } from "@/lib/whatsapp";

export async function POST(request: Request) {
  const operador = await autenticar(request);
  const { cadastroId } = await request.json();

  const cadastro = await db.cadastros.porId(cadastroId);

  // O telefone vem do CADASTRO, nunca do corpo da requisição: quem escolhe o número escolhe
  // para quem a jornada vai.
  if (!cadastro.telefone_verificado) {
    return Response.json({ erro: "telefone_nao_verificado" }, { status: 409 });
  }

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

  if (entry.kind !== "web") {
    return Response.json({ erro: "entrada_nao_web" }, { status: 409 });
  }

  // O token é o que vai para o WhatsApp. A entry.url fica aqui.
  const token = randomBytes(16).toString("base64url");

  await db.links.criar({
    token,
    url: entry.url,
    cadastro_id: cadastro.id,
    expira_em: verification.expires_at,
    usado_em: null,
  });

  await enviarTemplate(cadastro.telefone, cadastro.primeiro_nome, token);

  return Response.json({ enviado: true, expiresAt: verification.expires_at });
}
