// Substitua tudo aqui pela sua implementação.

export async function authenticate(_request: Request) {
  return { id: "operator-1" };
}

export interface Link {
  token: string;
  url: string;
  registration_id: string;
  expires_at: string;
  used_at: string | null;
}

export const db = {
  registrations: {
    async byId(_id: string) {
      return {
        id: "pedido-4471",
        cpf: "000.000.000-00",
        first_name: "<PRIMEIRO_NOME>",
        phone: "<TELEFONE_E164>",
        phone_verified: true,
      };
    },
  },
  links: {
    async create(_link: Link) {},
    /**
     * UPDATE condicional (`SET used_at = now() WHERE token = ? AND used_at IS NULL`),
     * nunca SELECT seguido de UPDATE: dois cliques simultâneos não podem resolver os dois.
     * A tabela precisa de índice único em `token`.
     */
    async consume(_token: string): Promise<Link | null> {
      return null;
    },
  },
};
