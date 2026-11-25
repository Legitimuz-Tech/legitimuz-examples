import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Confere o header X-Legitimuz-Signature: t=<unix>,v1=<hmac-sha256-hex>.
 * A string assinada é `${timestamp}.${corpo cru}` — o corpo original, byte a byte.
 */
export function isSignatureValid(rawBody: string, header: string, secret: string): boolean {
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=") as [string, string]));
  const timestamp = Number(parts.t);
  if (!timestamp || !parts.v1) return false;
  if (Math.abs(Math.floor(Date.now() / 1000) - timestamp) > 300) return false;

  const expected = createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(parts.v1, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}
