# Receptor de webhook

![Node 20](https://img.shields.io/badge/Node_20-5FA04E?logo=nodedotjs&logoColor=white&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=flat-square)
![HMAC SHA-256](https://img.shields.io/badge/HMAC_SHA--256-lightgrey?style=flat-square)

> Referência de implementação, não projeto executável.

[**Guia completo na doc →**](https://documentacao.legitimuz.com/guides/pocs/webhook-receiver)

O endpoint que recebe o desfecho. É a peça que mais dá errado, e a que mais importa acertar.

## Arquivos

```
app/api/webhooks/legitimuz/route.ts  # confere, deduplica, enfileira
worker.ts                            # o que fazer com verification.decided
lib/tipos.ts                         # o envelope dos sete eventos
lib/stubs.ts                         # db e fila — substitua
.env.example                         # as três variáveis
```

## Onde cada um entra

| Arquivo | Destino | Por quê |
| --- | --- | --- |
| `app/api/webhooks/legitimuz/route.ts` | a sua rota de webhook | os três passos numerados |
| `worker.ts` | junto do seu processamento assíncrono | o `switch` dos três status |
| `lib/tipos.ts` | junto dos seus tipos | o envelope, com os campos opcionais certos |

## Envs

```bash
LEGITIMUZ_WEBHOOK_SECRET=<SEGREDO_DO_ENDPOINT>
```

As outras duas não são usadas aqui, mas ficam no `.env.example` porque a integração completa
precisa das três.

## O que morde

- **Corpo cru, antes de qualquer parse.** `request.text()`, nunca `request.json()`. Reserializar
  muda os bytes e a assinatura falha em toda entrega.
- **`review` não é recusa.** O evento `verification.decided` dispara **de novo** para a mesma
  verificação quando um analista resolve a análise.
- **Deduplique com `INSERT` de chave única**, não `SELECT` seguido de `INSERT`: duas entregas
  simultâneas passariam pela checagem em separado.
- **Responda `2xx` e processe fora do request.** A Legitimuz reentrega o que não responde `2xx`, em
  até seis tentativas.
- **`timingSafeEqual` com checagem de tamanho antes.** A função lança se os buffers tiverem
  tamanhos diferentes.

## Testar localmente

```bash
npx untun tunnel http://localhost:3000
```

Cadastre a URL do túnel em Integrações → Segurança → Webhooks e dispare a entrega de teste pelo
dashboard. Veja [`pocs/local-tunnel`](../local-tunnel).

## O que não faz

Migrations e schema. Observabilidade e alerta. Sem retentativa própria — veja
[`pocs/queue-worker`](../queue-worker).

## Referência

[Segurança do webhook](https://documentacao.legitimuz.com/webhooks/security) ·
[Eventos](https://documentacao.legitimuz.com/webhooks/events) ·
[Status](https://documentacao.legitimuz.com/api/verification-status)
