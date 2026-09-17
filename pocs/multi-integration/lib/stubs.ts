// Substitua tudo aqui pela sua implementação.

export async function autenticar(_request: Request) {
  return { id: "usuario-1" };
}

export const db = {
  cadastros: {
    async porUsuario(_usuarioId: string) {
      return { id: "pedido-4471", cpf: "000.000.000-00", canal: "site" };
    },
    async vincular(_cadastroId: string, _publicId: string, _canal: string) {},
  },
  entregas: {
    async registrarSeInedita(_deliveryId: string): Promise<boolean> {
      return true;
    },
  },
};

export const fila = {
  async publicar(_evento: unknown) {},
};
