// Substitua tudo aqui pela sua implementação.

export const db = {
  cadastros: {
    async porRefId(_refId: string): Promise<{ id: string; desfecho_em: Date | null } | null> {
      return { id: "pedido-4471", desfecho_em: null };
    },
    async marcarEmAnalise(_cadastroId: string) {},
    async aplicarDesfecho(_cadastroId: string, _status: string) {},
  },
};
