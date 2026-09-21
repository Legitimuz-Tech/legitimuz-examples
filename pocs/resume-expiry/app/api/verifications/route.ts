import { authenticate, db } from "@/lib/stubs";

export async function POST(request: Request) {
  const user = await authenticate(request);
  const registration = await db.registrations.byUser(user.id);

  // 1. Já decidiu? Não há jornada para abrir.
  if (registration.outcome) {
    return Response.json({ outcome: registration.outcome }, { status: 409 });
  }

  // 2. Existe e ainda vale? A idempotência devolve a mesma, com o status já avançado.
  const stillValid = registration.expires_at && new Date(registration.expires_at) > new Date();
  const refId = stillValid ? registration.ref_id! : `${registration.id}-${Date.now()}`;

  const response = await fetch("https://api.legitimuz.com/public/verifications", {
    method: "POST",
    headers: {
      "X-API-Key": process.env.LEGITIMUZ_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      schema_version: "1.0",
      ref_id: refId,
      document: { type: "cpf", number: registration.cpf },
      flow_public_id: process.env.LEGITIMUZ_FLOW_ID!,
    }),
  });

  const { verification, entry } = await response.json();

  // 3. Grave sempre: o ref_id mudou no caso da expiração, e o webhook virá com o novo.
  await db.registrations.updateVerification(registration.id, {
    ref_id: refId,
    public_id: verification.public_id,
    expires_at: verification.expires_at,
  });

  return Response.json({ entry });
}
