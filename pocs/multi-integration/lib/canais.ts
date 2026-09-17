/* Um canal é uma integração da Legitimuz. As três credenciais andam JUNTAS: trocar a chave sem
   trocar o segredo do webhook é o erro que só aparece na primeira entrega. */
export interface Canal {
  apiKey: string;
  flowId: string;
  webhookSecret: string;
}

export const CANAIS: Record<string, Canal> = {
  site: {
    apiKey: process.env.LEGITIMUZ_API_KEY_SITE!,
    flowId: process.env.LEGITIMUZ_FLOW_ID_SITE!,
    webhookSecret: process.env.LEGITIMUZ_WEBHOOK_SECRET_SITE!,
  },
  app: {
    apiKey: process.env.LEGITIMUZ_API_KEY_APP!,
    flowId: process.env.LEGITIMUZ_FLOW_ID_APP!,
    webhookSecret: process.env.LEGITIMUZ_WEBHOOK_SECRET_APP!,
  },
};

export function canalDe(nome: string): Canal {
  const canal = CANAIS[nome];
  // Falha cedo e alto: canal desconhecido com fallback silencioso cria verificação na conta errada.
  if (!canal) throw new Error(`canal desconhecido: ${nome}`);

  return canal;
}
