// Substitua tudo aqui pela sua implementação.

export async function authenticate(_request: Request) {
  return { id: "user-1" };
}

export const db = {
  registrations: {
    async byUser(_userId: string) {
      return { id: "pedido-4471", cpf: "000.000.000-00", outcome: null as string | null };
    },
  },
};

/** A criação em si é a das outras POCs. Veja pocs/express-backend. */
export async function createVerification() {
  return {
    verification: { public_id: "<PUBLIC_ID>", expires_at: new Date().toISOString() },
    entry: { kind: "web" as const, url: "<ENTRY_URL>" },
  };
}
