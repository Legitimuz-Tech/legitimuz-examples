# Backend em Express

![Node 20](https://img.shields.io/badge/Node_20-5FA04E?logo=nodedotjs&logoColor=white&style=flat-square)
![Express 5](https://img.shields.io/badge/Express_5-000000?logo=express&logoColor=white&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=flat-square)

> Referência de implementação, não projeto executável.

[**Guia completo na doc →**](https://documentacao.legitimuz.com/guides/pocs/express-backend)

As duas pontas do ciclo: a rota que cria a verificação e devolve a `entry` ao seu front, e o
endpoint que recebe o desfecho e confere a assinatura.

## Arquivos

```
server.ts          # as duas rotas
assinatura.ts      # conferência do X-Legitimuz-Signature
stubs.ts           # autenticar(), db e fila — substitua tudo
package.json       # referência de dependência, sem lockfile
.env.example       # as três variáveis
```

## Onde cada arquivo entra

| Arquivo | Destino | Por quê |
| --- | --- | --- |
| `server.ts` | junto das suas rotas | as duas rotas, com o middleware certo em cada uma |
| `assinatura.ts` | uma pasta de utilitários | a conferência é a mesma em qualquer framework Node |
| `stubs.ts` | **não vai** | é o contrato do que o seu código precisa oferecer |

## Envs

```bash
LEGITIMUZ_API_KEY=<SUA_CHAVE>
LEGITIMUZ_WEBHOOK_SECRET=<SEGREDO_DO_ENDPOINT>
LEGITIMUZ_FLOW_ID=<FLOW_PUBLIC_ID>
```

Integrações → Segurança para as duas primeiras, Solução KYC → Fluxos para a terceira. Use uma
integração **sandbox**; nenhuma das três vai para o browser.

## Pontos de atenção

- **A ordem dos middlewares.** A rota de webhook usa `express.raw`, não `express.json`. Um
  `express.json()` global antes dela consome o corpo e a assinatura passa a falhar sempre.
- **O CPF vem do seu cadastro, nunca do corpo da requisição.** Se o cliente escolhe o documento,
  qualquer um cria verificação para qualquer pessoa na sua conta.
- **Só a `entry` volta para o cliente.** O `verification.public_id` fica no seu banco, para ligar o
  webhook ao seu pedido.
- **A criação é idempotente por `ref_id`**, o que torna o retry seguro depois de um timeout.
- **Deduplique pelo `X-Legitimuz-Delivery`.** A entrega é reenviada até seis vezes e a ordem não é
  garantida.

## Limitações

`autenticar()`, `db` e `fila` são stubs sem implementação real. Sem migration,
observabilidade ou retentativa própria. O `resposta.ok` não é conferido, para o exemplo caber numa
tela — no seu código, confira.

## Referência

[Emitir a credencial](https://documentacao.legitimuz.com/guides/credential) ·
[Criar verificação](https://documentacao.legitimuz.com/api/create-verification) ·
[Segurança do webhook](https://documentacao.legitimuz.com/webhooks/security) ·
[Eventos](https://documentacao.legitimuz.com/webhooks/events)
