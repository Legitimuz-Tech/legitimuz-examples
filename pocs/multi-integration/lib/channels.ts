/* Um canal é uma integração da Legitimuz. As três credenciais andam JUNTAS: trocar a chave sem
   trocar o segredo do webhook é o erro que só aparece na primeira entrega. */
export interface Channel {
  apiKey: string;
  flowId: string;
  webhookSecret: string;
}

export const CHANNELS: Record<string, Channel> = {
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

export function channelFor(name: string): Channel {
  const channel = CHANNELS[name];
  // Falha de forma explícita: canal desconhecido com fallback silencioso cria verificação na conta errada.
  if (!channel) throw new Error(`unknown channel: ${name}`);

  return channel;
}
