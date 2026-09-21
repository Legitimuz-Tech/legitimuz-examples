import { createHmac, timingSafeEqual } from "node:crypto";
import { outcomeQueue } from "@/lib/queues";

const TOLERANCE_SECONDS = 300;

export async function POST(request: Request) {
  const rawBody = await request.text();
  const deliveryId = request.headers.get("x-legitimuz-delivery") ?? "";

  if (!isSignatureValid(rawBody, request.headers.get("x-legitimuz-signature") ?? "")) {
    return new Response(null, { status: 401 });
  }

  // jobId é a chave de idempotência: a fila recusa o mesmo id e a reentrega vira no-op.
  await outcomeQueue.add("outcome", JSON.parse(rawBody), {
    jobId: deliveryId,
    attempts: 5,
    backoff: { type: "exponential", delay: 1_000 },
    removeOnComplete: 1_000,
  });

  return new Response(null, { status: 200 });
}

function isSignatureValid(rawBody: string, header: string): boolean {
  const secret = process.env.LEGITIMUZ_WEBHOOK_SECRET!;
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=") as [string, string]));

  const timestamp = Number(parts.t);
  if (!timestamp || !parts.v1) return false;
  if (Math.abs(Math.floor(Date.now() / 1000) - timestamp) > TOLERANCE_SECONDS) return false;

  const expected = createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(parts.v1, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}
