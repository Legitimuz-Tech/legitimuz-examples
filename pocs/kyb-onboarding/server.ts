import express from "express";
import { isSignatureValid } from "./signature";
import { authenticate, db } from "./stubs";

const app = express();

app.post("/api/company-verifications", express.json(), async (req, res) => {
  const user = await authenticate(req);
  if (!user) return res.status(401).json({ error: "not_authenticated" });

  const registration = await db.company.byUser(user.id);

  const response = await fetch("https://api-core.legitimuz.com/public/verifications", {
    method: "POST",
    headers: {
      "X-API-Key": process.env.LEGITIMUZ_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      schema_version: "1.0",
      ref_id: registration.id,
      document: { type: "cnpj", number: registration.cnpj },
      flow_public_id: process.env.LEGITIMUZ_FLOW_ID!,
    }),
  });

  // A consulta da empresa ficou indisponível: nada foi criado, o cliente pode tentar de novo.
  if (response.status === 503) return res.status(503).json({ error: "try_again" });

  const { verification, business, entry } = await response.json();
  await db.company.link(registration.id, verification.public_id, business.public_id);

  // Empresa barrada: a verificação já nasce reprovada e nenhuma jornada precisa abrir.
  if (business.impediment !== null) {
    await db.company.blocked(registration.id, business.impediment);
    return res.json({ blocked: true });
  }

  res.json({ entry });
});

// `raw`, não `json`: a conferência da assinatura precisa dos bytes originais.
app.post(
  "/api/webhooks/legitimuz",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const rawBody = req.body.toString("utf8");
    const signature = req.get("X-Legitimuz-Signature") ?? "";

    if (!isSignatureValid(rawBody, signature, process.env.LEGITIMUZ_WEBHOOK_SECRET!)) {
      return res.sendStatus(401);
    }

    const isNew = await db.deliveries.recordIfNew(req.get("X-Legitimuz-Delivery")!);
    const event = JSON.parse(rawBody);

    // O desfecho da empresa é o da verificação de identidade do sócio escolhido.
    if (isNew && event.event === "verification.decided" && event.verification.kind === "kyb") {
      await db.company.decide(event.verification.ref_id, event.verification.status);
    }

    res.sendStatus(200);
  }
);

app.listen(3000);
