import { db } from "@/lib/stubs";

export async function GET(_: Request, { params }: { params: { token: string } }) {
  // `consume` é um UPDATE condicional, não um SELECT seguido de UPDATE: dois cliques
  // simultâneos no mesmo link não podem resolver os dois.
  const link = await db.links.consume(params.token);

  if (!link) return new Response("Link inválido ou já usado", { status: 410 });
  if (new Date(link.expires_at) < new Date()) {
    return new Response("Link expirado", { status: 410 });
  }

  // 302 e no-store: a URL de destino não pode ficar em cache de proxy nem no histórico do CDN.
  return new Response(null, {
    status: 302,
    headers: { Location: link.url, "Cache-Control": "no-store" },
  });
}
