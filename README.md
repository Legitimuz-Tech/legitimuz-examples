# Legitimuz — exemplos de integração

Um diretório por superfície de integração documentada, mostrando **quais arquivos a integração
exige e o que vai em cada um**.

> **Referência de implementação.** Nenhum diretório aqui é um projeto executável. Não há lockfile,
> não há `node_modules` e nada foi rodado contra a sandbox. O que existe é a árvore de arquivos que
> você replica no seu projeto.

A documentação completa, com a prosa e as explicações de cada passo, fica em
[documentacao.legitimuz.com](https://documentacao.legitimuz.com). Este repo é o complemento dela:
a doc explica *por quê*, os diretórios aqui mostram *onde*.

## Como isto se organiza

O caminho de cada exemplo espelha o caminho da página na doc. `/guides/web/react` vira
`web/react/`, `/guides/pocs/express-backend` vira `pocs/express-backend/`.

Todo diretório tem um `README.md` com a árvore de arquivos, uma tabela dizendo onde cada arquivo
entra no seu projeto, e o link para a página correspondente.

## Web SDK

O SDK é carregado por CDN e registra `window.Legitimuz`. Não há pacote npm para instalar.

| Exemplo | Página | Estado |
| --- | --- | --- |
| [`web/vanilla-js`](web/vanilla-js) | [Vanilla JS](https://documentacao.legitimuz.com/guides/web/vanilla-js) | pronto |
| [`web/react`](web/react) | [React](https://documentacao.legitimuz.com/guides/web/react) | pronto |
| `web/next-js` | [Next.js](https://documentacao.legitimuz.com/guides/web/next-js) | a fazer |
| `web/nuxt` | [Nuxt](https://documentacao.legitimuz.com/guides/web/nuxt) | a fazer |
| `web/vue` | [Vue](https://documentacao.legitimuz.com/guides/web/vue) | a fazer |
| `web/svelte` | [Svelte](https://documentacao.legitimuz.com/guides/web/svelte) | a fazer |
| `web/angular` | [Angular](https://documentacao.legitimuz.com/guides/web/angular) | a fazer |
| `web/remix` | [Remix](https://documentacao.legitimuz.com/guides/web/remix) | a fazer |
| `web/tanstack-start` | [TanStack Start](https://documentacao.legitimuz.com/guides/web/tanstack-start) | a fazer |

## Backend e padrões de integração

| Exemplo | Página | Estado |
| --- | --- | --- |
| [`pocs/express-backend`](pocs/express-backend) | [Backend Express](https://documentacao.legitimuz.com/guides/pocs/express-backend) | pronto |
| `pocs/next-checkout` | [Checkout Next.js](https://documentacao.legitimuz.com/guides/pocs/next-checkout) | a fazer |
| `pocs/fastapi-backend` | [Backend FastAPI](https://documentacao.legitimuz.com/guides/pocs/fastapi-backend) | a fazer |
| `pocs/laravel-backend` | [Backend Laravel](https://documentacao.legitimuz.com/guides/pocs/laravel-backend) | a fazer |
| `pocs/go-backend` | [Backend Go](https://documentacao.legitimuz.com/guides/pocs/go-backend) | a fazer |
| `pocs/webhook-receiver` | [Receptor de webhook](https://documentacao.legitimuz.com/guides/pocs/webhook-receiver) | a fazer |
| `pocs/queue-worker` | [Fila e worker](https://documentacao.legitimuz.com/guides/pocs/queue-worker) | a fazer |
| `pocs/multi-integration` | [Multi-integração](https://documentacao.legitimuz.com/guides/pocs/multi-integration) | a fazer |
| `pocs/qr-handoff` | [QR code](https://documentacao.legitimuz.com/guides/pocs/qr-handoff) | a fazer |
| `pocs/whatsapp-handoff` | [WhatsApp](https://documentacao.legitimuz.com/guides/pocs/whatsapp-handoff) | a fazer |
| `pocs/resume-expiry` | [Retomada e expiração](https://documentacao.legitimuz.com/guides/pocs/resume-expiry) | a fazer |
| `pocs/local-tunnel` | [Ambiente local](https://documentacao.legitimuz.com/guides/pocs/local-tunnel) | a fazer |

## Mobile SDKs

| Exemplo | Página | Estado |
| --- | --- | --- |
| `sdks/android` | [Android](https://documentacao.legitimuz.com/sdks/android) | a fazer |
| `sdks/ios` | [iOS](https://documentacao.legitimuz.com/sdks/ios) | a fazer |
| `sdks/react-native` | [React Native](https://documentacao.legitimuz.com/sdks/react-native) | a fazer |

Os artefatos mobile são privados e liberados sob solicitação. Veja [`sdks/`](sdks).

## As três variáveis

Toda integração de servidor usa as mesmas três. Elas nunca vão para o browser nem para o app.

| Variável | Onde achar |
| --- | --- |
| `LEGITIMUZ_API_KEY` | Integrações → Segurança → Chaves de API. Aparece uma vez |
| `LEGITIMUZ_WEBHOOK_SECRET` | Integrações → Segurança → Webhooks, na criação do endpoint |
| `LEGITIMUZ_FLOW_ID` | Solução KYC → Fluxos, no menu da linha, em **Copiar ID do fluxo** |

Use uma integração **sandbox**.

## Contribuir

O padrão que todo exemplo segue está em [CONTRIBUTING.md](CONTRIBUTING.md).
