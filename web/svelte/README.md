# Svelte

![Svelte 5](https://img.shields.io/badge/Svelte_5-FF3E00?logo=svelte&logoColor=white&style=flat-square)
![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?logo=svelte&logoColor=white&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=flat-square)

> Referência de implementação, não projeto executável.

[**Guia completo na doc →**](https://documentacao.legitimuz.com/guides/web/svelte)

Monte no cliente, emita no servidor. O `onMount` só roda no browser, então `window.Legitimuz` está
lá quando o componente monta; a `sdkUrl` vem do `load` do servidor, e a chave de API fica só lá.

## Arquivos

```
src/app.html                              # a tag do CDN (index.html em Svelte puro)
src/lib/legitimuz.d.ts                    # os tipos do global
src/lib/VerificationWidget.svelte         # mount no onMount, destroy no retorno
src/routes/verificacao/+page.server.ts    # busca a credencial no servidor
src/routes/verificacao/+page.svelte       # passa a sdkUrl como prop
package.json                              # referência de dependência, sem lockfile
```

## Onde cada um entra

| Arquivo | Destino | Por quê |
| --- | --- | --- |
| `src/app.html` | o `app.html` do SvelteKit | em Svelte puro, o `index.html` |
| `src/lib/legitimuz.d.ts` | `src/lib/` | o build de CDN não traz tipos |
| `src/lib/VerificationWidget.svelte` | `src/lib/` | o único arquivo que toca em `window.Legitimuz` |
| `src/routes/verificacao/+page.server.ts` | a rota que abre a verificação | mantém a credencial fora do bundle |

## Envs

Nenhuma no cliente. A `sdkUrl` chega pelo `load` do servidor. A chave de API fica na sua rota de
API, que este exemplo não traz — veja [`pocs/express-backend`](../../pocs/express-backend).

## O que morde

- **O retorno do `onMount` é o cleanup.** É ele que chama `destroy()`. Sem isso, o indicador de
  câmera do browser continua aceso depois de navegar para outra rota.
- **`log.push` funciona porque `log` é `$state`.** Em Svelte 5 a runa torna o array reativo; um
  array comum não atualizaria a tela.
- **O container precisa de altura.**

## O que não faz

Não traz a rota `/api/verificacoes`. Não trata o desfecho: a decisão chega ao seu backend por
webhook.

## Referência

[Opções da SDK](https://documentacao.legitimuz.com/guides/web/sdk-options) ·
[Eventos](https://documentacao.legitimuz.com/guides/web/best-practices/events) ·
[Erros](https://documentacao.legitimuz.com/guides/web/best-practices/errors)
