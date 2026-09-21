import { createHmac, timingSafeEqual } from "node:crypto";
import { db, queue } from "@/lib/stubs";

const TOLERANCE_SECONDS = 300;

export async function POST(request: Request) {
  // CORPO CRU, antes de qualquer parse. Reserializar quebra a assinatura.
  const rawBody = await request.text();
  const signature = request.headers.get("x-legitimuz-signature") ?? "";
  const deliveryId = request.headers.get("x-legitimuz-delivery") ?? "";

  if (!isSignatureValid(rawBody, signature, process.env.LEGITIMUZ_WEBHOOK_SECRET!)) {
    return new Response(null, { status: 401 });
  }

  const isNew = await db.deliveries.recordIfNew(deliveryId);
  if (!isNew) return new Response(null, { status: 200 });

  await queue.publish(JSON.parse(rawBody));
  return new Response(null, { status: 200 });
}

function isSignatureValid(rawBody: string, header: string, secret: string): boolean {
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=") as [string, string]));

  const timestamp = Number(parts.t);
  const received = parts.v1;
  if (!timestamp || !received) return false;

  if (Math.abs(Math.floor(Date.now() / 1000) - timestamp) > TOLERANCE_SECONDS) return false;

  const expected = createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex");

  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(received, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}
