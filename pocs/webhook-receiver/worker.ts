import { db } from "./lib/stubs";
import type { LegitimuzEnvelope } from "./lib/types";

export async function processEvent(event: LegitimuzEnvelope) {
  // Evento desconhecido não derruba nada: registre e siga.
  if (event.event !== "verification.decided" || !event.verification) return;

  const { status, ref_id } = event.verification;
  if (!ref_id) return;

  switch (status) {
    case "approved":
      await db.registration.approve(ref_id);
      break;
    case "reproved":
      await db.registration.reject(ref_id);
      break;
    case "review":
      // Não é recusa. Este evento dispara DE NOVO quando um analista decidir.
      await db.registration.markUnderReview(ref_id);
      break;
  }
}
