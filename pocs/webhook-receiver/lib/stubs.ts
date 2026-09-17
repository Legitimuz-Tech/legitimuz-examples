// Substitua tudo aqui pela sua implementação.

export async function autenticar() {
  return { id: "usuario-1" };
}

export const db = {
  cadastro: {
    async porUsuario(_usuarioId: string) {
      return { id: "pedido-4471", cpf: "000.000.000-00" };
    },
    async vincular(_cadastroId: string, _verificacaoPublicId: string) {},
    async liberar(_refId: string) {},
    async recusar(_refId: string) {},
    async marcarEmAnalise(_refId: string) {},
  },
  entregas: {
    /** Deduplica pelo header X-Legitimuz-Delivery. INSERT com chave única, não SELECT + INSERT. */
    async registrarSeInedita(_deliveryId: string): Promise<boolean> {
      return true;
    },
  },
};

export const fila = {
  async publicar(_evento: unknown) {},
};
