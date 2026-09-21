import express from "express";
import { isSignatureValid } from "./signature";
import { authenticate, db, queue } from "./stubs";

const app = express();

app.post("/api/verifications", express.json(), async (req, res) => {
  const user = await authenticate(req);
  if (!user) return res.status(401).json({ error: "not_authenticated" });

  // O documento vem do SEU cadastro. Se vier do corpo da requisição, qualquer um cria
  // verificação para qualquer pessoa na sua conta.
  const registration = await db.registration.byUser(user.id);

  const response = await fetch("https://api.legitimuz.com/public/verifications", {
    method: "POST",
    headers: {
      "X-API-Key": process.env.LEGITIMUZ_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      schema_version: "1.0",
      ref_id: registration.id,
      document: { type: "cpf", number: registration.cpf },
      flow_public_id: process.env.LEGITIMUZ_FLOW_ID!,
    }),
  });

  const { verification, entry } = await response.json();

  // Guarde o vínculo antes de responder: sem ele, o webhook chega e você não sabe de quem é.
  await db.registration.link(registration.id, verification.public_id);

  // Só a entry vai para o cliente. Nada mais.
  res.json({ entry });
});

// `raw`, não `json`: a conferência da assinatura precisa dos bytes originais.
app.post("/api/webhooks/legitimuz", express.raw({ type: "application/json" }), async (req, res) => {
  const rawBody = req.body.toString("utf8");
  const signature = req.get("X-Legitimuz-Signature") ?? "";

  if (!isSignatureValid(rawBody, signature, process.env.LEGITIMUZ_WEBHOOK_SECRET!)) {
    return res.sendStatus(401);
  }

  // Responda rápido e processe fora do ciclo da requisição.
  const isNew = await db.deliveries.recordIfNew(req.get("X-Legitimuz-Delivery")!);
  if (isNew) await queue.publish(JSON.parse(rawBody));

  res.sendStatus(200);
});

app.listen(3000);
