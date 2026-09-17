// Substitua tudo aqui pela sua implementação.
import type { H3Event } from "h3";

export async function autenticar(_event: H3Event) {
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
