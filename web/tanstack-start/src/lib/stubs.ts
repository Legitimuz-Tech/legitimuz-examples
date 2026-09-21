// Substitua tudo aqui pela sua implementação.

export async function authenticate(_request?: Request) {
  return { id: "user-1" };
}

export const db = {
  registration: {
    async byUser(_userId: string) {
      return { id: "pedido-4471", cpf: "000.000.000-00" };
    },
    async link(_registrationId: string, _verificationPublicId: string) {},
  },
};
