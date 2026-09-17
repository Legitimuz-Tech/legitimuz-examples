import { db } from "./lib/stubs";
import type { EnvelopeLegitimuz } from "./lib/tipos";

export async function processar(evento: EnvelopeLegitimuz) {
  // Evento desconhecido não derruba nada: registre e siga.
  if (evento.event !== "verification.decided" || !evento.verification) return;

  const { status, ref_id } = evento.verification;
  if (!ref_id) return;

  switch (status) {
    case "approved":
      await db.cadastro.liberar(ref_id);
      break;
    case "reproved":
      await db.cadastro.recusar(ref_id);
      break;
    case "review":
      // Não é recusa. Este evento dispara DE NOVO quando um analista decidir.
      await db.cadastro.marcarEmAnalise(ref_id);
      break;
  }
}
