import express from "express";
import { assinaturaValida } from "./assinatura";
import { autenticar, db, fila } from "./stubs";

const app = express();

app.post("/api/verificacoes", express.json(), async (req, res) => {
  const usuario = await autenticar(req);
  if (!usuario) return res.status(401).json({ erro: "nao_autenticado" });

  // O documento vem do SEU cadastro. Se vier do corpo da requisição, qualquer um cria
  // verificação para qualquer pessoa na sua conta.
  const cadastro = await db.cadastro.porUsuario(usuario.id);

  const resposta = await fetch("https://api.legitimuz.com/public/verifications", {
    method: "POST",
    headers: {
      "X-API-Key": process.env.LEGITIMUZ_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      schema_version: "1.0",
      ref_id: cadastro.id,
      document: { type: "cpf", number: cadastro.cpf },
      flow_public_id: process.env.LEGITIMUZ_FLOW_ID!,
    }),
  });

  const { verification, entry } = await resposta.json();

  // Guarde o vínculo antes de responder: sem ele, o webhook chega e você não sabe de quem é.
  await db.cadastro.vincular(cadastro.id, verification.public_id);

  // Só a entry vai para o cliente. Nada mais.
  res.json({ entry });
});

// `raw`, não `json`: a conferência da assinatura precisa dos bytes originais.
app.post("/api/webhooks/legitimuz", express.raw({ type: "application/json" }), async (req, res) => {
  const corpoCru = req.body.toString("utf8");
  const assinatura = req.get("X-Legitimuz-Signature") ?? "";

  if (!assinaturaValida(corpoCru, assinatura, process.env.LEGITIMUZ_WEBHOOK_SECRET!)) {
    return res.sendStatus(401);
  }

  // Responda rápido e processe fora do ciclo da requisição.
  const inedita = await db.entregas.registrarSeInedita(req.get("X-Legitimuz-Delivery")!);
  if (inedita) await fila.publicar(JSON.parse(corpoCru));

  res.sendStatus(200);
});

app.listen(3000);
