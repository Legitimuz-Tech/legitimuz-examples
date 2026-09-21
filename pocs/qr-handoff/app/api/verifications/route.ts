import QRCode from "qrcode";
import { createVerification } from "@/lib/stubs";

export async function POST() {
  const { verification, entry } = await createVerification();

  if (entry.kind !== "web") {
    return Response.json({ error: "entry_not_web" }, { status: 409 });
  }

  // O QR é gerado no SERVIDOR. A URL não passa pelo estado do cliente nem por analytics.
  const qr = await QRCode.toDataURL(entry.url, { margin: 1, width: 320 });

  return Response.json({ qr, expiresAt: verification.expires_at });
}
