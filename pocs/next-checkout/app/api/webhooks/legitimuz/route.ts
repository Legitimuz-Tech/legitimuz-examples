import { createHmac, timingSafeEqual } from "node:crypto";
import { db, fila } from "@/lib/stubs";

const TOLERANCIA_SEGUNDOS = 300;

export async function POST(request: Request) {
  // CORPO CRU, antes de qualquer parse. Reserializar quebra a assinatura.
  const corpoCru = await request.text();
  const assinatura = request.headers.get("x-legitimuz-signature") ?? "";
  const entregaId = request.headers.get("x-legitimuz-delivery") ?? "";

  if (!assinaturaValida(corpoCru, assinatura, process.env.LEGITIMUZ_WEBHOOK_SECRET!)) {
    return new Response(null, { status: 401 });
  }

  const inedita = await db.entregas.registrarSeInedita(entregaId);
  if (!inedita) return new Response(null, { status: 200 });

  await fila.publicar(JSON.parse(corpoCru));
  return new Response(null, { status: 200 });
}

function assinaturaValida(corpoCru: string, header: string, segredo: string): boolean {
  const partes = Object.fromEntries(header.split(",").map((p) => p.split("=") as [string, string]));

  const timestamp = Number(partes.t);
  const recebida = partes.v1;
  if (!timestamp || !recebida) return false;

  if (Math.abs(Math.floor(Date.now() / 1000) - timestamp) > TOLERANCIA_SEGUNDOS) return false;

  const esperada = createHmac("sha256", segredo).update(`${timestamp}.${corpoCru}`).digest("hex");

  const a = Buffer.from(esperada, "utf8");
  const b = Buffer.from(recebida, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}
