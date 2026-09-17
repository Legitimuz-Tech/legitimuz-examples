import { createHmac, timingSafeEqual } from "node:crypto";
import { desfechoQueue } from "@/lib/filas";

const TOLERANCIA_SEGUNDOS = 300;

export async function POST(request: Request) {
  const corpoCru = await request.text();
  const entregaId = request.headers.get("x-legitimuz-delivery") ?? "";

  if (!assinaturaValida(corpoCru, request.headers.get("x-legitimuz-signature") ?? "")) {
    return new Response(null, { status: 401 });
  }

  // jobId é a chave de idempotência: a fila recusa o mesmo id e a reentrega vira no-op.
  await desfechoQueue.add("desfecho", JSON.parse(corpoCru), {
    jobId: entregaId,
    attempts: 5,
    backoff: { type: "exponential", delay: 1_000 },
    removeOnComplete: 1_000,
  });

  return new Response(null, { status: 200 });
}

function assinaturaValida(corpoCru: string, header: string): boolean {
  const segredo = process.env.LEGITIMUZ_WEBHOOK_SECRET!;
  const partes = Object.fromEntries(header.split(",").map((p) => p.split("=") as [string, string]));

  const timestamp = Number(partes.t);
  if (!timestamp || !partes.v1) return false;
  if (Math.abs(Math.floor(Date.now() / 1000) - timestamp) > TOLERANCIA_SEGUNDOS) return false;

  const esperada = createHmac("sha256", segredo).update(`${timestamp}.${corpoCru}`).digest("hex");
  const a = Buffer.from(esperada, "utf8");
  const b = Buffer.from(partes.v1, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}
