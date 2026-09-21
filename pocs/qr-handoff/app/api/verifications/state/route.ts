import { authenticate, db } from "@/lib/stubs";

// Lê o que o SEU webhook já gravou. Não chame a Legitimuz num intervalo: além de bater no
// teto da chave, o desfecho confiável é o que você persistiu.
export async function GET(request: Request) {
  const user = await authenticate(request);
  const registration = await db.registrations.byUser(user.id);

  return Response.json({ outcome: registration.outcome ?? null });
}
