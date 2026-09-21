// Substitua tudo aqui pela sua implementação.

export const db = {
  registrations: {
    async byRefId(_refId: string): Promise<{ id: string; outcome_at: Date | null } | null> {
      return { id: "pedido-4471", outcome_at: null };
    },
    async markUnderReview(_registrationId: string) {},
    async applyOutcome(_registrationId: string, _status: string) {},
  },
};
