// Substitua tudo aqui pela sua implementação.

export async function autenticar(_request: Request) {
  return { id: "usuario-1" };
}

export const db = {
  cadastros: {
    async porUsuario(_usuarioId: string) {
      return { id: "pedido-4471", cpf: "000.000.000-00", desfecho: null as string | null };
    },
  },
};

/** A criação em si é a das outras POCs. Veja pocs/express-backend. */
export async function criarVerificacao() {
  return {
    verification: { public_id: "<PUBLIC_ID>", expires_at: new Date().toISOString() },
    entry: { kind: "web" as const, url: "<ENTRY_URL>" },
  };
}
