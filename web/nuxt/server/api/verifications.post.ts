export default defineEventHandler(async (event) => {
  const user = await authenticate(event);

  // O documento vem do SEU cadastro, nunca do corpo da requisição.
  const registration = await db.registration.byUser(user.id);

  const response = await $fetch<{ verification: { public_id: string }; entry: { url: string } }>(
    "https://api.legitimuz.com/public/verifications",
    {
      method: "POST",
      headers: { "X-API-Key": useRuntimeConfig().legitimuzApiKey },
      body: {
        schema_version: "1.0",
        ref_id: registration.id,
        document: { type: "cpf", number: registration.cpf },
        flow_public_id: useRuntimeConfig().legitimuzFlowId,
      },
    }
  );

  // Guarde o vínculo antes de responder: sem ele, o webhook chega e você não sabe de quem é.
  await db.registration.link(registration.id, response.verification.public_id);

  // Só a entry vai para o cliente.
  return { entry: response.entry };
});
