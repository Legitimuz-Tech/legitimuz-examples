# Checkout em Next.js

![Next.js 15](https://img.shields.io/badge/Next.js_15-000000?logo=nextdotjs&logoColor=white&style=flat-square)
![React 19](https://img.shields.io/badge/React_19-20232A?logo=react&logoColor=61DAFB&style=flat-square)
![App Router](https://img.shields.io/badge/App_Router-lightgrey?style=flat-square)

> Referência de implementação, não projeto executável.

[**Guia completo na doc →**](https://documentacao.legitimuz.com/guides/pocs/next-checkout)

O ciclo inteiro num projeto só: a rota que cria a verificação, a página que abre o fluxo e o
handler que recebe o desfecho.

## Arquivos

```
app/api/verificacoes/route.ts        # cria a verificação
app/api/webhooks/legitimuz/route.ts  # recebe o desfecho
app/cadastro/page.tsx                # abre o fluxo
lib/stubs.ts                         # autenticar(), db e fila — substitua tudo
package.json                         # referência de dependência, sem lockfile
.env.example                         # as três variáveis
```

## Onde cada arquivo entra

| Arquivo | Destino | Por quê |
| --- | --- | --- |
| `app/api/verificacoes/route.ts` | `app/api/` | os quatro passos numerados da criação |
| `app/api/webhooks/legitimuz/route.ts` | `app/api/` | `request.text()` dá o corpo cru |
| `app/cadastro/page.tsx` | a tela de cadastro | a máquina de três estados |
| `lib/stubs.ts` | **não vai** | é o contrato do que o seu código precisa oferecer |

## Envs

```bash
LEGITIMUZ_API_KEY=<SUA_CHAVE>
LEGITIMUZ_WEBHOOK_SECRET=<SEGREDO_DO_ENDPOINT>
LEGITIMUZ_FLOW_ID=<FLOW_PUBLIC_ID>
```

Sem prefixo `NEXT_PUBLIC_`: as três só existem no servidor.

## Pontos de atenção

- **A tela nunca libera o cadastro.** Ela só muda para "aguardando". Quem libera é o handler de
  webhook, no servidor, onde o titular não pode interferir.
- **Grave o vínculo antes de responder.** Sem ele o webhook chega e você não sabe de quem é.
- **O `cancelado` no efeito.** Entre o `fetch` e o `mount`, o componente pode ter desmontado; sem a
  flag, o widget monta num container que já saiu da árvore.
- **`request.text()`, não `request.json()`**, na rota de webhook.

## Limitações

Migrations e schema. Observabilidade e alerta. Tela de retomada quando o titular abandona e volta —
veja [`pocs/resume-expiry`](../resume-expiry).

## Referência

[Emitir a credencial](https://documentacao.legitimuz.com/guides/credential) ·
[Segurança do webhook](https://documentacao.legitimuz.com/webhooks/security) ·
[Eventos](https://documentacao.legitimuz.com/webhooks/events)
