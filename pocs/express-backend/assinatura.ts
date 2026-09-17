import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Confere o header X-Legitimuz-Signature: t=<unix>,v1=<hmac-sha256-hex>.
 * A string assinada é `${timestamp}.${corpo cru}` — o corpo original, byte a byte.
 */
export function assinaturaValida(corpoCru: string, header: string, segredo: string): boolean {
  const partes = Object.fromEntries(header.split(",").map((p) => p.split("=") as [string, string]));
  const timestamp = Number(partes.t);
  if (!timestamp || !partes.v1) return false;
  if (Math.abs(Math.floor(Date.now() / 1000) - timestamp) > 300) return false;

  const esperada = createHmac("sha256", segredo).update(`${timestamp}.${corpoCru}`).digest("hex");
  const a = Buffer.from(esperada, "utf8");
  const b = Buffer.from(partes.v1, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}
