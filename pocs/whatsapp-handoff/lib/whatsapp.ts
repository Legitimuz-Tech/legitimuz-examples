const GRAPH = "https://graph.facebook.com/v21.0";

export async function sendTemplate(phone: string, name: string, token: string) {
  const response = await fetch(`${GRAPH}/${process.env.WHATSAPP_PHONE_ID}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: phone,
      type: "template",
      template: {
        name: "identity_verification",
        language: { code: "pt_BR" },
        components: [
          { type: "body", parameters: [{ type: "text", text: name }] },
          // O sufixo do botão: a base da URL é fixa no template aprovado.
          {
            type: "button",
            sub_type: "url",
            index: "0",
            parameters: [{ type: "text", text: token }],
          },
        ],
      },
    }),
  });

  if (!response.ok) {
    // Não registre o corpo da resposta cru em log: ele repete o telefone do titular.
    throw new Error(`whatsapp_${response.status}`);
  }
}
