import { assinaturaValida } from "@/lib/assinatura";
import { canalDe } from "@/lib/canais";
import { db, fila } from "@/lib/stubs";

export async function POST(request: Request, { params }: { params: { canal: string } }) {
  const canal = canalDe(params.canal);
  const corpoCru = await request.text();

  // Cada rota confere contra o SEU próprio segredo.
  if (
    !assinaturaValida(
      corpoCru,
      request.headers.get("x-legitimuz-signature") ?? "",
      canal.webhookSecret
    )
  ) {
    return new Response(null, { status: 401 });
  }

  const inedita = await db.entregas.registrarSeInedita(
    request.headers.get("x-legitimuz-delivery")!
  );
  if (inedita) await fila.publicar({ canal: params.canal, evento: JSON.parse(corpoCru) });

  return new Response(null, { status: 200 });
}
