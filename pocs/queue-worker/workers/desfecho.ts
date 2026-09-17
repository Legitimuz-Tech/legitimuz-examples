import { Worker } from "bullmq";
import { db } from "../lib/stubs";

new Worker(
  "desfecho",
  async (job) => {
    const evento = job.data;

    if (evento.event !== "verification.decided") return;

    const cadastro = await db.cadastros.porRefId(evento.verification.ref_id);
    if (!cadastro) throw new Error(`ref_id sem cadastro: ${evento.verification.ref_id}`);

    // Ordem não é garantida: descarte o evento mais antigo que o estado já gravado.
    if (cadastro.desfecho_em && new Date(evento.occurred_at) < cadastro.desfecho_em) return;

    // `review` não é recusa: a verificação volta a decidir depois, e este mesmo evento
    // chega de novo.
    if (evento.verification.status === "review") {
      await db.cadastros.marcarEmAnalise(cadastro.id);
      return;
    }

    await db.cadastros.aplicarDesfecho(cadastro.id, evento.verification.status);
  },
  { connection: { host: process.env.REDIS_HOST, port: 6379 }, concurrency: 5 }
);
