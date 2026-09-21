import { Worker } from "bullmq";
import { db } from "../lib/stubs";

new Worker(
  "outcome",
  async (job) => {
    const event = job.data;

    if (event.event !== "verification.decided") return;

    const registration = await db.registrations.byRefId(event.verification.ref_id);
    if (!registration) throw new Error(`no registration for ref_id: ${event.verification.ref_id}`);

    // Ordem não é garantida: descarte o evento mais antigo que o estado já gravado.
    if (registration.outcome_at && new Date(event.occurred_at) < registration.outcome_at) return;

    // `review` não é recusa: a verificação volta a decidir depois, e este mesmo evento
    // chega de novo.
    if (event.verification.status === "review") {
      await db.registrations.markUnderReview(registration.id);
      return;
    }

    await db.registrations.applyOutcome(registration.id, event.verification.status);
  },
  { connection: { host: process.env.REDIS_HOST, port: 6379 }, concurrency: 5 }
);
