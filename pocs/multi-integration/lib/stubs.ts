// Substitua tudo aqui pela sua implementação.

export async function authenticate(_request: Request) {
  return { id: "user-1" };
}

export const db = {
  registrations: {
    async byUser(_userId: string) {
      return { id: "pedido-4471", cpf: "000.000.000-00", channel: "site" };
    },
    async link(_registrationId: string, _publicId: string, _channel: string) {},
  },
  deliveries: {
    async recordIfNew(_deliveryId: string): Promise<boolean> {
      return true;
    },
  },
};

export const queue = {
  async publish(_event: unknown) {},
};
