// Substitua tudo aqui pela sua implementação.

export async function authenticate(_request: Request) {
  return { id: "user-1" };
}

export interface Registration {
  id: string;
  cpf: string;
  ref_id: string | null;
  expires_at: string | null;
  outcome: string | null;
}

export const db = {
  registrations: {
    async byUser(_userId: string): Promise<Registration> {
      return {
        id: "pedido-4471",
        cpf: "000.000.000-00",
        ref_id: null,
        expires_at: null,
        outcome: null,
      };
    },
    async updateVerification(
      _registrationId: string,
      _data: { ref_id: string; public_id: string; expires_at: string }
    ) {},
  },
};
