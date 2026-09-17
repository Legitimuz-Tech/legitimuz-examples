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
| <img src="https://cdn.simpleicons.org/express/888888" width="16" /> | [`pocs/express-backend`](pocs/express-backend) | [Backend Express](https://documentacao.legitimuz.com/guides/pocs/express-backend) |

Em breve: `next-checkout`, `fastapi-backend`, `laravel-backend`, `go-backend`,
`webhook-receiver`, `queue-worker`, `multi-integration`, `qr-handoff`, `whatsapp-handoff`,
`resume-expiry`, `local-tunnel`.

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
