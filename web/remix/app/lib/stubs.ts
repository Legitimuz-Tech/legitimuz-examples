// Substitua tudo aqui pela sua implementação.

export async function autenticar(_request?: Request) {
  return { id: "usuario-1" };
}

export const db = {
  cadastro: {
    async porUsuario(_usuarioId: string) {
      return { id: "pedido-4471", cpf: "000.000.000-00" };
    },
    async vincular(_cadastroId: string, _verificacaoPublicId: string) {},
  },
};
