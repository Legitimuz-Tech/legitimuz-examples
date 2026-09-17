# Fila e worker

![Node 20](https://img.shields.io/badge/Node_20-5FA04E?logo=nodedotjs&logoColor=white&style=flat-square)
![BullMQ](https://img.shields.io/badge/BullMQ-lightgrey?style=flat-square)
![Redis](https://img.shields.io/badge/Redis-FF4438?logo=redis&logoColor=white&style=flat-square)

> Referência de implementação, não projeto executável.

[**Guia completo na doc →**](https://documentacao.legitimuz.com/guides/pocs/queue-worker)

O endpoint de webhook tem um trabalho só: conferir a assinatura e aceitar. Tudo o que demora
acontece depois, num worker com a retentativa que ele entende.

## Arquivos

```
app/api/webhooks/legitimuz/route.ts  # confere e enfileira, nada mais
workers/desfecho.ts                  # o worker, com retentativa própria
lib/filas.ts                         # a Queue do BullMQ
lib/stubs.ts                         # db — substitua
package.json                         # referência de dependência, sem lockfile
.env.example                         # as três variáveis + REDIS_HOST
```

## Onde cada um entra

| Arquivo | Destino | Por quê |
| --- | --- | --- |
| `app/api/webhooks/legitimuz/route.ts` | a sua rota de webhook | mostra o `jobId` como idempotência |
| `workers/desfecho.ts` | o seu processo de worker | roda fora do servidor HTTP |
| `lib/filas.ts` | junto da sua infra de fila | a conexão, num lugar só |

## Envs

```bash
LEGITIMUZ_WEBHOOK_SECRET=<SEGREDO_DO_ENDPOINT>
REDIS_HOST=localhost
```

## O que morde

- **`jobId` substitui a tabela de deduplicação.** Um id só existe uma vez na fila, então a segunda
  entrega do mesmo evento não cria um segundo job.
- **Lançar dentro do worker é o caminho certo de erro.** O BullMQ conta a tentativa e reprograma.
  Um `try/catch` que engole a exceção marca o job como concluído e o desfecho se perde em silêncio.
- **Ordem não é garantida.** Se a sua lógica depende disso, compare `occurred_at` com o estado já
  gravado e descarte o atrasado.
- **Não processe dentro do request.** Uma tarefa lenta vira timeout, a entrega é reenviada, e o seu
  retry passa a ser o retry da Legitimuz — que não conhece o seu banco.

## O que não faz

Sem dead-letter queue: depois de 5 tentativas o job fica em `failed` e ninguém é avisado. Sem
métrica de profundidade da fila. Sem lock por `ref_id`, então dois eventos da mesma verificação
podem rodar em paralelo.

## Referência

[Segurança do webhook](https://documentacao.legitimuz.com/webhooks/security) ·
[Eventos](https://documentacao.legitimuz.com/webhooks/events) ·
[Receptor de webhook](https://documentacao.legitimuz.com/guides/pocs/webhook-receiver)
