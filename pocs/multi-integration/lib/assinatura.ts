import { createHmac, timingSafeEqual } from "node:crypto";

const TOLERANCIA_SEGUNDOS = 300;

export function assinaturaValida(corpoCru: string, header: string, segredo: string): boolean {
  const partes = Object.fromEntries(header.split(",").map((p) => p.split("=") as [string, string]));
  const timestamp = Number(partes.t);
  if (!timestamp || !partes.v1) return false;
  if (Math.abs(Math.floor(Date.now() / 1000) - timestamp) > TOLERANCIA_SEGUNDOS) return false;

  const esperada = createHmac("sha256", segredo).update(`${timestamp}.${corpoCru}`).digest("hex");
  const a = Buffer.from(esperada, "utf8");
  const b = Buffer.from(partes.v1, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}
