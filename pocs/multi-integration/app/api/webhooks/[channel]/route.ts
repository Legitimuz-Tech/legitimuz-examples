import { channelFor } from "@/lib/channels";
import { isSignatureValid } from "@/lib/signature";
import { db, queue } from "@/lib/stubs";

export async function POST(request: Request, { params }: { params: { channel: string } }) {
  const channel = channelFor(params.channel);
  const rawBody = await request.text();

  // Cada rota confere contra o SEU próprio segredo.
  if (
    !isSignatureValid(
      rawBody,
      request.headers.get("x-legitimuz-signature") ?? "",
      channel.webhookSecret
    )
  ) {
    return new Response(null, { status: 401 });
  }

  const isNew = await db.deliveries.recordIfNew(request.headers.get("x-legitimuz-delivery")!);
  if (isNew) await queue.publish({ channel: params.channel, event: JSON.parse(rawBody) });

  return new Response(null, { status: 200 });
}
