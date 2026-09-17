// Substitua tudo aqui pela sua implementação.

export async function autenticar(_request: Request) {
  return { id: "operador-1" };
}

export interface Link {
  token: string;
  url: string;
  cadastro_id: string;
  expira_em: string;
  usado_em: string | null;
}

export const db = {
  cadastros: {
    async porId(_id: string) {
      return {
        id: "pedido-4471",
        cpf: "000.000.000-00",
        primeiro_nome: "<PRIMEIRO_NOME>",
        telefone: "<TELEFONE_E164>",
        telefone_verificado: true,
      };
    },
  },
  links: {
    async criar(_link: Link) {},
    /**
     * UPDATE condicional (`SET usado_em = now() WHERE token = ? AND usado_em IS NULL`),
     * nunca SELECT seguido de UPDATE: dois cliques simultâneos não podem resolver os dois.
     * A tabela precisa de índice único em `token`.
     */
    async consumir(_token: string): Promise<Link | null> {
      return null;
    },
  },
};
