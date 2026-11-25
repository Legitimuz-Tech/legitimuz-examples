// Substitua tudo aqui pela sua implementação. Este arquivo existe para deixar visível onde o seu
// código encaixa — não há banco, não há migration e não há sessão de verdade.

import type { Request } from "express";

export interface User {
  id: string;
}

export interface CompanyRegistration {
  id: string;
  cnpj: string;
}

export type Outcome = "approved" | "reproved" | "review" | "inconclusive";

/** Substitua pela sua autenticação. */
export async function authenticate(_req: Request): Promise<User | null> {
  return { id: "user-1" };
}

/** Substitua pelo seu banco. */
export const db = {
  company: {
    async byUser(_userId: string): Promise<CompanyRegistration> {
      return { id: "cadastro-pj-8812", cnpj: "00.000.000/0001-00" };
    },
    async link(_registrationId: string, _verificationId: string, _businessId: string): Promise<void> {},
    /** Empresa barrada na criação: o motivo já veio na resposta, sem jornada. */
    async blocked(_registrationId: string, _impediment: string): Promise<void> {},
    async decide(_registrationId: string, _outcome: Outcome): Promise<void> {},
  },
  deliveries: {
    /** Deduplica pelo header X-Legitimuz-Delivery. Devolve false se já viu esta entrega. */
    async recordIfNew(_deliveryId: string): Promise<boolean> {
      return true;
    },
  },
};
