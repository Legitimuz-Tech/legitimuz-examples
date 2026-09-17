// Substitua tudo aqui pela sua implementação. Este arquivo existe para deixar visível onde o seu
// código encaixa — não há banco, não há migration e não há sessão de verdade.

import type { Request } from "express";

export interface Usuario {
  id: string;
}

export interface Cadastro {
  id: string;
  cpf: string;
}

/** Substitua pela sua autenticação. */
export async function autenticar(_req: Request): Promise<Usuario | null> {
  return { id: "usuario-1" };
}

/** Substitua pelo seu banco. */
export const db = {
  cadastro: {
    async porUsuario(_usuarioId: string): Promise<Cadastro> {
      return { id: "pedido-4471", cpf: "000.000.000-00" };
    },
    async vincular(_cadastroId: string, _verificacaoPublicId: string): Promise<void> {},
  },
  entregas: {
    /** Deduplica pelo header X-Legitimuz-Delivery. Devolve false se já viu esta entrega. */
    async registrarSeInedita(_deliveryId: string): Promise<boolean> {
      return true;
    },
  },
};

/** Substitua pela sua fila. */
export const fila = {
  async publicar(_evento: unknown): Promise<void> {},
};
