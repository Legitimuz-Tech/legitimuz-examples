const GRAPH = "https://graph.facebook.com/v21.0";

export async function enviarTemplate(telefone: string, nome: string, token: string) {
  const resposta = await fetch(`${GRAPH}/${process.env.WHATSAPP_PHONE_ID}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: telefone,
      type: "template",
      template: {
        name: "verificacao_identidade",
        language: { code: "pt_BR" },
        components: [
          { type: "body", parameters: [{ type: "text", text: nome }] },
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

  if (!resposta.ok) {
    // Não registre o corpo da resposta cru em log: ele repete o telefone do titular.
    throw new Error(`whatsapp_${resposta.status}`);
  }
}
