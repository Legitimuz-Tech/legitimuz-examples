# Exemplos de integração

Um diretório por superfície de integração: quais arquivos ela exige, e o que vai em cada um.

> **Referência de implementação.** Nada aqui é projeto executável. Sem lockfile, sem
> `node_modules`, nada rodado contra a sandbox.

A [documentação](https://documentacao.legitimuz.com) explica *por quê*. Estes diretórios mostram
*onde*.

## Web SDK

Carregado por CDN, registra `window.Legitimuz`. Não há pacote npm.

| | Exemplo | Guia |
| :-: | --- | --- |
| <img src="https://cdn.simpleicons.org/javascript/f7df1e" width="16" /> | [`web/vanilla-js`](web/vanilla-js) | [Vanilla JS](https://documentacao.legitimuz.com/guides/web/vanilla-js) |
| <img src="https://cdn.simpleicons.org/react/61dafb" width="16" /> | [`web/react`](web/react) | [React](https://documentacao.legitimuz.com/guides/web/react) |
| <img src="https://cdn.simpleicons.org/nextdotjs/888888" width="16" /> | [`web/next-js`](web/next-js) | [Next.js](https://documentacao.legitimuz.com/guides/web/next-js) |
| <img src="https://cdn.simpleicons.org/nuxt/00dc82" width="16" /> | [`web/nuxt`](web/nuxt) | [Nuxt](https://documentacao.legitimuz.com/guides/web/nuxt) |
| <img src="https://cdn.simpleicons.org/vuedotjs/4fc08d" width="16" /> | [`web/vue`](web/vue) | [Vue](https://documentacao.legitimuz.com/guides/web/vue) |
| <img src="https://cdn.simpleicons.org/svelte/ff3e00" width="16" /> | [`web/svelte`](web/svelte) | [Svelte](https://documentacao.legitimuz.com/guides/web/svelte) |
| <img src="https://cdn.simpleicons.org/angular/dd0031" width="16" /> | [`web/angular`](web/angular) | [Angular](https://documentacao.legitimuz.com/guides/web/angular) |
| <img src="https://cdn.simpleicons.org/reactrouter/ca4245" width="16" /> | [`web/remix`](web/remix) | [Remix](https://documentacao.legitimuz.com/guides/web/remix) |
| <img src="https://cdn.simpleicons.org/tanstack/888888" width="16" /> | [`web/tanstack-start`](web/tanstack-start) | [TanStack Start](https://documentacao.legitimuz.com/guides/web/tanstack-start) |

## Backend

Duas rotas, os mesmos nomes em toda linguagem: `POST /api/verificacoes` e
`POST /api/webhooks/legitimuz`.

| | Exemplo | Guia |
| :-: | --- | --- |
| <img src="https://cdn.simpleicons.org/nextdotjs/888888" width="16" /> | [`pocs/next-checkout`](pocs/next-checkout) | [Checkout Next.js](https://documentacao.legitimuz.com/guides/pocs/next-checkout) |
| <img src="https://cdn.simpleicons.org/express/888888" width="16" /> | [`pocs/express-backend`](pocs/express-backend) | [Backend Express](https://documentacao.legitimuz.com/guides/pocs/express-backend) |
| <img src="https://cdn.simpleicons.org/fastapi/009688" width="16" /> | [`pocs/fastapi-backend`](pocs/fastapi-backend) | [Backend FastAPI](https://documentacao.legitimuz.com/guides/pocs/fastapi-backend) |
| <img src="https://cdn.simpleicons.org/laravel/ff2d20" width="16" /> | [`pocs/laravel-backend`](pocs/laravel-backend) | [Backend Laravel](https://documentacao.legitimuz.com/guides/pocs/laravel-backend) |
| <img src="https://cdn.simpleicons.org/go/00add8" width="16" /> | [`pocs/go-backend`](pocs/go-backend) | [Backend Go](https://documentacao.legitimuz.com/guides/pocs/go-backend) |
| <img src="https://cdn.simpleicons.org/nodedotjs/5fa04e" width="16" /> | [`pocs/webhook-receiver`](pocs/webhook-receiver) | [Receptor de webhook](https://documentacao.legitimuz.com/guides/pocs/webhook-receiver) |
| <img src="https://cdn.simpleicons.org/redis/ff4438" width="16" /> | [`pocs/queue-worker`](pocs/queue-worker) | [Fila e worker](https://documentacao.legitimuz.com/guides/pocs/queue-worker) |
| <img src="https://cdn.simpleicons.org/nodedotjs/5fa04e" width="16" /> | [`pocs/multi-integration`](pocs/multi-integration) | [Multi-integração](https://documentacao.legitimuz.com/guides/pocs/multi-integration) |
| <img src="https://cdn.simpleicons.org/nextdotjs/888888" width="16" /> | [`pocs/qr-handoff`](pocs/qr-handoff) | [QR code](https://documentacao.legitimuz.com/guides/pocs/qr-handoff) |
| <img src="https://cdn.simpleicons.org/whatsapp/25d366" width="16" /> | [`pocs/whatsapp-handoff`](pocs/whatsapp-handoff) | [WhatsApp](https://documentacao.legitimuz.com/guides/pocs/whatsapp-handoff) |
| <img src="https://cdn.simpleicons.org/nextdotjs/888888" width="16" /> | [`pocs/resume-expiry`](pocs/resume-expiry) | [Retomada e expiração](https://documentacao.legitimuz.com/guides/pocs/resume-expiry) |
| <img src="https://cdn.simpleicons.org/gnubash/4eaa25" width="16" /> | [`pocs/local-tunnel`](pocs/local-tunnel) | [Ambiente local](https://documentacao.legitimuz.com/guides/pocs/local-tunnel) |

## Mobile

Em breve: `android`, `ios`, `react-native`. Os artefatos são privados e liberados sob solicitação —
veja [`sdks/`](sdks).

## Como ler

O caminho de cada exemplo espelha o da página na doc: `/guides/web/react` vira `web/react/`.

Cada diretório tem um `README.md` com a árvore de arquivos e uma tabela dizendo onde cada arquivo
entra no seu projeto.

## Envs

| Variável | Onde achar |
| --- | --- |
| `LEGITIMUZ_API_KEY` | Integrações → Segurança → Chaves de API |
| `LEGITIMUZ_WEBHOOK_SECRET` | Integrações → Segurança → Webhooks |
| `LEGITIMUZ_FLOW_ID` | Solução KYC → Fluxos → Copiar ID do fluxo |

Use uma integração **sandbox**. Nenhuma delas vai para o browser ou para o app.

## Contribuir

O padrão que todo exemplo segue está em [CONTRIBUTING.md](CONTRIBUTING.md).
