// Substitua tudo aqui pela sua implementação.
import type { H3Event } from "h3";

export async function authenticate(_event: H3Event) {
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
