/** O envelope comum a todos os sete eventos. Campos novos podem aparecer:
 *  não valide com schema que rejeita desconhecidos. */
export interface EnvelopeLegitimuz {
  id: string;
  event: string;
  occurred_at: string;
  tenant_public_id: string;
  resource: { type: "verification"; public_id: string };
  verification?: {
    status: "approved" | "reproved" | "review";
    ref_id: string | null;
    decided_at: string;
  };
}
