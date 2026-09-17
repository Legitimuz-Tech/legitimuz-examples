# Exemplos de integração

Um diretório por superfície de integração: quais arquivos ela exige, e o que vai em cada um.

> **Referência de implementação.** Nada aqui é projeto executável. Sem lockfile, sem
> `node_modules`, nada rodado contra a sandbox.

A [documentação](https://documentacao.legitimuz.com) explica *por quê*. Estes diretórios mostram
*onde*.

## Web SDK

Carregado por CDN, registra `window.Legitimuz`. Não há pacote npm.

| | Exemplo | Guia | Atualizado |
| :-: | --- | --- | --- |
| <img src="https://cdn.simpleicons.org/javascript/f7df1e" width="16" /> | [`web/vanilla-js`](web/vanilla-js) | [Vanilla JS](https://documentacao.legitimuz.com/guides/web/vanilla-js) | ![](https://img.shields.io/github/last-commit/Legitimuz-Tech/legitimuz-examples?path=web%2Fvanilla-js&label=&style=flat-square&color=lightgrey) |
| <img src="https://cdn.simpleicons.org/react/61dafb" width="16" /> | [`web/react`](web/react) | [React](https://documentacao.legitimuz.com/guides/web/react) | ![](https://img.shields.io/github/last-commit/Legitimuz-Tech/legitimuz-examples?path=web%2Freact&label=&style=flat-square&color=lightgrey) |

Em breve: `next-js`, `nuxt`, `vue`, `svelte`, `angular`, `remix`, `tanstack-start`.

## Backend

Duas rotas, os mesmos nomes em toda linguagem: `POST /api/verificacoes` e
`POST /api/webhooks/legitimuz`.

| | Exemplo | Guia | Atualizado |
| :-: | --- | --- | --- |
| <img src="https://cdn.simpleicons.org/express/333333/dddddd" width="16" /> | [`pocs/express-backend`](pocs/express-backend) | [Backend Express](https://documentacao.legitimuz.com/guides/pocs/express-backend) | ![](https://img.shields.io/github/last-commit/Legitimuz-Tech/legitimuz-examples?path=pocs%2Fexpress-backend&label=&style=flat-square&color=lightgrey) |

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

## As três variáveis

`LEGITIMUZ_API_KEY`, `LEGITIMUZ_WEBHOOK_SECRET` e `LEGITIMUZ_FLOW_ID` saem de Integrações →
Segurança e de Solução KYC → Fluxos. Use uma integração **sandbox**. Nenhuma delas vai para o
browser ou para o app.

## Contribuir

O padrão que todo exemplo segue está em [CONTRIBUTING.md](CONTRIBUTING.md).
