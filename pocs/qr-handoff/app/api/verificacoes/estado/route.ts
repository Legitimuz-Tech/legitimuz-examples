import { autenticar, db } from "@/lib/stubs";

// Lê o que o SEU webhook já gravou. Não chame a Legitimuz num intervalo: além de bater no
// teto da chave, o desfecho confiável é o que você persistiu.
export async function GET(request: Request) {
  const usuario = await autenticar(request);
  const cadastro = await db.cadastros.porUsuario(usuario.id);

  return Response.json({ desfecho: cadastro.desfecho ?? null });
}
