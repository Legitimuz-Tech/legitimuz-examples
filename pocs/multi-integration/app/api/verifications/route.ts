import { channelFor } from "@/lib/channels";
import { authenticate, db } from "@/lib/stubs";

export async function POST(request: Request) {
  const user = await authenticate(request);
  const registration = await db.registrations.byUser(user.id);

  // O canal vem do SEU contexto — a origem do cadastro, não um campo que o cliente manda.
  const channel = channelFor(registration.channel);

  const response = await fetch("https://api.legitimuz.com/public/verifications", {
    method: "POST",
    headers: { "X-API-Key": channel.apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      schema_version: "1.0",
      ref_id: registration.id,
      document: { type: "cpf", number: registration.cpf },
      flow_public_id: channel.flowId,
    }),
  });

  const { verification, entry } = await response.json();
  await db.registrations.link(registration.id, verification.public_id, registration.channel);

  return Response.json({ entry });
}
