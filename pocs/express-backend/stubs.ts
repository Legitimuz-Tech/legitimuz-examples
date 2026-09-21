// Substitua tudo aqui pela sua implementação. Este arquivo existe para deixar visível onde o seu
// código encaixa — não há banco, não há migration e não há sessão de verdade.

import type { Request } from "express";

export interface User {
  id: string;
}

export interface Registration {
  id: string;
  cpf: string;
}

/** Substitua pela sua autenticação. */
export async function authenticate(_req: Request): Promise<User | null> {
  return { id: "user-1" };
}

/** Substitua pelo seu banco. */
export const db = {
  registration: {
    async byUser(_userId: string): Promise<Registration> {
      return { id: "pedido-4471", cpf: "000.000.000-00" };
    },
    async link(_registrationId: string, _verificationPublicId: string): Promise<void> {},
  },
  deliveries: {
    /** Deduplica pelo header X-Legitimuz-Delivery. Devolve false se já viu esta entrega. */
    async recordIfNew(_deliveryId: string): Promise<boolean> {
      return true;
    },
  },
};

/** Substitua pela sua fila. */
export const queue = {
  async publish(_event: unknown): Promise<void> {},
};
