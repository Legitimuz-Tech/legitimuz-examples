import { NextResponse } from "next/server";
import { authenticate, db } from "@/lib/stubs";

export async function POST() {
  // 1. Quem está pedindo? Sem isto, qualquer um cria verificação na sua conta.
  const user = await authenticate();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  // 2. O CPF vem do SEU cadastro, nunca do corpo da requisição.
  const registration = await db.registration.byUser(user.id);

  const response = await fetch("https://api.legitimuz.com/public/verifications", {
    method: "POST",
    headers: {
      "X-API-Key": process.env.LEGITIMUZ_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      schema_version: "1.0",
      ref_id: registration.id,
      document: { type: "cpf", number: registration.cpf },
      flow_public_id: process.env.LEGITIMUZ_FLOW_ID!,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("legitimuz", response.status, error.message, response.headers.get("X-Request-Id"));
    return NextResponse.json({ error: "create_failed" }, { status: 502 });
  }

  const { verification, entry } = await response.json();

  // 3. Grave o vínculo ANTES de responder. Sem ele, o webhook chega órfão.
  await db.registration.link(registration.id, verification.public_id);

  // 4. Devolva só a entry.
  return NextResponse.json({ entry });
}
