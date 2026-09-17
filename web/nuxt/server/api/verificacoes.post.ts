export default defineEventHandler(async (event) => {
  const usuario = await autenticar(event);

  // O documento vem do SEU cadastro, nunca do corpo da requisição.
  const cadastro = await db.cadastro.porUsuario(usuario.id);

  const resposta = await $fetch<{ verification: { public_id: string }; entry: { url: string } }>(
    "https://api.legitimuz.com/public/verifications",
    {
      method: "POST",
      headers: { "X-API-Key": useRuntimeConfig().legitimuzApiKey },
      body: {
        schema_version: "1.0",
        ref_id: cadastro.id,
        document: { type: "cpf", number: cadastro.cpf },
        flow_public_id: useRuntimeConfig().legitimuzFlowId,
      },
    }
  );

  // Guarde o vínculo antes de responder: sem ele, o webhook chega e você não sabe de quem é.
  await db.cadastro.vincular(cadastro.id, resposta.verification.public_id);

  // Só a entry vai para o cliente.
  return { entry: resposta.entry };
});
