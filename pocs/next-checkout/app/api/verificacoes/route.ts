import { NextResponse } from "next/server";
import { autenticar, db } from "@/lib/stubs";

export async function POST() {
  // 1. Quem está pedindo? Sem isto, qualquer um cria verificação na sua conta.
  const usuario = await autenticar();
  if (!usuario) return NextResponse.json({ erro: "nao_autenticado" }, { status: 401 });

  // 2. O CPF vem do SEU cadastro, nunca do corpo da requisição.
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

  if (!resposta.ok) {
    const erro = await resposta.json();
    console.error("legitimuz", resposta.status, erro.message, resposta.headers.get("X-Request-Id"));
    return NextResponse.json({ erro: "falha_ao_criar" }, { status: 502 });
  }

  const { verification, entry } = await resposta.json();

  // 3. Grave o vínculo ANTES de responder. Sem ele, o webhook chega órfão.
  await db.cadastro.vincular(cadastro.id, verification.public_id);

  // 4. Devolva só a entry.
  return NextResponse.json({ entry });
}
