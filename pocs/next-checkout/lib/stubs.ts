// Substitua tudo aqui pela sua implementação.

export async function authenticate() {
  return { id: "user-1" };
}

export const db = {
  registration: {
    async byUser(_userId: string) {
      return { id: "pedido-4471", cpf: "000.000.000-00" };
    },
    async link(_registrationId: string, _verificationPublicId: string) {},
    async approve(_refId: string) {},
    async reject(_refId: string) {},
    async markUnderReview(_refId: string) {},
  },
  deliveries: {
    /** Deduplica pelo header X-Legitimuz-Delivery. INSERT com chave única, não SELECT + INSERT. */
    async recordIfNew(_deliveryId: string): Promise<boolean> {
      return true;
    },
  },
};

export const queue = {
  async publish(_event: unknown) {},
};
