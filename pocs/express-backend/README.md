# Backend em Express

> **Referência de implementação.** Este diretório mostra quais arquivos a integração exige e o que
> vai em cada um — não é um projeto executável.

**Página da doc:** [Backend Express](https://documentacao.legitimuz.com/guides/pocs/express-backend)

| | |
| --- | --- |
| **Stack** | Node 20 · Express 5 · TypeScript |
| **Você terá** | a rota que emite a credencial e o endpoint de webhook no mesmo servidor |

As duas pontas do ciclo: a rota que cria a verificação e devolve a `entry` ao seu front, e o
endpoint que recebe o desfecho e confere a assinatura.

## Árvore de arquivos

```
pocs/express-backend/
├── server.ts          # as duas rotas
├── assinatura.ts      # conferência do X-Legitimuz-Signature
├── stubs.ts           # autenticar(), db e fila — substitua tudo
├── package.json       # referência de dependência, sem lockfile
└── .env.example       # as três variáveis
```

## Onde cada arquivo entra

| Arquivo | Onde vai no seu projeto | Por quê |
| --- | --- | --- |
| `server.ts` | junto das suas rotas | as duas rotas, com o middleware certo em cada uma |
| `assinatura.ts` | uma pasta de utilitários | a conferência é a mesma em qualquer framework Node |
| `stubs.ts` | **não vai** | é o contrato do que o seu código precisa oferecer |

## Variáveis de ambiente

```bash
LEGITIMUZ_API_KEY=<SUA_CHAVE>
LEGITIMUZ_WEBHOOK_SECRET=<SEGREDO_DO_ENDPOINT>
LEGITIMUZ_FLOW_ID=<FLOW_PUBLIC_ID>
```

| Variável | Onde achar |
| --- | --- |
| `LEGITIMUZ_API_KEY` | Integrações → Segurança → Chaves de API. Aparece uma vez |
| `LEGITIMUZ_WEBHOOK_SECRET` | Integrações → Segurança → Webhooks, na criação do endpoint |
| `LEGITIMUZ_FLOW_ID` | Solução KYC → Fluxos, no menu da linha, em **Copiar ID do fluxo** |

Use uma integração **sandbox**. Nenhum dos três vai para o browser.

## Detalhes que não são óbvios

- **A ordem dos middlewares importa.** A rota de webhook usa `express.raw`, não `express.json`. Um
  `express.json()` global antes dela consome o corpo e a conferência da assinatura passa a falhar
  sempre.
- **O CPF vem do seu cadastro, nunca do corpo da requisição.** Se o cliente escolhe o documento,
  qualquer um cria verificação para qualquer pessoa na sua conta.
- **Só a `entry` volta para o cliente.** O `verification.public_id` fica no seu banco, para ligar o
  webhook ao seu pedido.
- **A criação é idempotente por `ref_id`.** Repetir com o mesmo `ref_id` e o mesmo corpo devolve a
  verificação existente com `200`, o que torna o retry seguro depois de um timeout.
- **Deduplique pelo `X-Legitimuz-Delivery`.** A entrega é reenviada até seis vezes e a ordem de
  chegada não é garantida.

## O que este exemplo não faz

- `autenticar()` é um stub, `db` é um objeto de mentira e `fila` não publica nada.
- Não há migration, schema de banco, observabilidade nem retentativa própria.
- Não há tela de retomada quando o titular abandona e volta.
- Não trata os códigos de erro da criação. O `resposta.ok` não é conferido de propósito, para o
  exemplo caber numa tela; no seu código, confira.

## Referência

- [Emitir a credencial](https://documentacao.legitimuz.com/guides/credential) — a chamada e o retry
- [Criar verificação](https://documentacao.legitimuz.com/api/create-verification) — os campos e os onze códigos
- [Segurança do webhook](https://documentacao.legitimuz.com/webhooks/security) — a assinatura em quatro linguagens
- [Eventos de webhook](https://documentacao.legitimuz.com/webhooks/events) — os sete eventos e os payloads
