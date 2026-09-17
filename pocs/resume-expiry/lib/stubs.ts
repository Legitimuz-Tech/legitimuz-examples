// Substitua tudo aqui pela sua implementação.

export async function autenticar(_request: Request) {
  return { id: "usuario-1" };
}

export interface Cadastro {
  id: string;
  cpf: string;
  ref_id: string | null;
  expira_em: string | null;
  desfecho: string | null;
}

export const db = {
  cadastros: {
    async porUsuario(_usuarioId: string): Promise<Cadastro> {
      return {
        id: "pedido-4471",
        cpf: "000.000.000-00",
        ref_id: null,
        expira_em: null,
        desfecho: null,
      };
    },
    async atualizarVerificacao(
      _cadastroId: string,
      _dados: { ref_id: string; public_id: string; expira_em: string }
    ) {},
  },
};
