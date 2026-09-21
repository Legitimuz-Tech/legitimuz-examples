import { randomBytes } from "node:crypto";
import { authenticate, db } from "@/lib/stubs";
import { sendTemplate } from "@/lib/whatsapp";

export async function POST(request: Request) {
  const operator = await authenticate(request);
  const { registrationId } = await request.json();

  const registration = await db.registrations.byId(registrationId);

  // O telefone vem do CADASTRO, nunca do corpo da requisição: quem escolhe o número escolhe
  // para quem a jornada vai.
  if (!registration.phone_verified) {
    return Response.json({ error: "phone_not_verified" }, { status: 409 });
  }

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

  const { verification, entry } = await response.json();

  if (entry.kind !== "web") {
    return Response.json({ error: "entry_not_web" }, { status: 409 });
  }

  // O token é o que vai para o WhatsApp. A entry.url fica aqui.
  const token = randomBytes(16).toString("base64url");

  await db.links.create({
    token,
    url: entry.url,
    registration_id: registration.id,
    expires_at: verification.expires_at,
    used_at: null,
  });

  await sendTemplate(registration.phone, registration.first_name, token);

  return Response.json({ sent: true, expiresAt: verification.expires_at });
}
