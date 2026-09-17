# Nuxt

![Nuxt 3](https://img.shields.io/badge/Nuxt_3-00DC82?logo=nuxt&logoColor=white&style=flat-square)
![Vue 3](https://img.shields.io/badge/Vue_3-4FC08D?logo=vuedotjs&logoColor=white&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=flat-square)

> Referência de implementação, não projeto executável.

[**Guia completo na doc →**](https://documentacao.legitimuz.com/guides/web/nuxt)

É o único exemplo de `web/` que traz as duas pontas: o componente que monta o widget **e** a rota
de servidor que emite a credencial. No Nuxt as duas moram no mesmo projeto.

## Arquivos

```
nuxt.config.ts                  # o script no head e o runtimeConfig
package.json                    # referência de dependência, sem lockfile
.env.example                    # a chave e o fluxo, só no servidor
types/legitimuz.d.ts            # os tipos do global
composables/useLegitimuz.ts     # mount no onMounted, destroy no onUnmounted
server/api/verificacoes.post.ts # emite a credencial e devolve só a entry
server/utils/stubs.ts           # autenticar() e db — substitua
pages/verificacao.vue           # o container dentro de <ClientOnly>
```

## Onde cada arquivo entra

| Arquivo | Destino | Por quê |
| --- | --- | --- |
| `nuxt.config.ts` | o seu `nuxt.config.ts` | o script vai no `head`, o segredo no `runtimeConfig` |
| `composables/useLegitimuz.ts` | `composables/` | o auto-import do Nuxt o expõe sem `import` |
| `server/api/verificacoes.post.ts` | `server/api/` | a chave só existe aqui |
| `pages/verificacao.vue` | a rota que abre a verificação | o `<ClientOnly>` em volta do container |
| `types/legitimuz.d.ts` | `types/` | o build de CDN não traz tipos |
| `server/utils/stubs.ts` | **não vai** | é o contrato do que o seu código precisa oferecer |

## Envs

```bash
NUXT_LEGITIMUZ_API_KEY=<SUA_CHAVE>
NUXT_LEGITIMUZ_FLOW_ID=<FLOW_PUBLIC_ID>
```

O Nuxt mapeia `runtimeConfig.legitimuzApiKey` para `NUXT_LEGITIMUZ_API_KEY`. **Sem** o prefixo
`NUXT_PUBLIC_`: com ele, o valor iria para o bundle do cliente.

## Pontos de atenção

- **`<ClientOnly>` em volta do container.** O widget usa `window` e a câmera, que só existem no
  browser. Sem isso, o SSR quebra em `window is not defined`.
- **`runtimeConfig` sem `public`.** Qualquer coisa em `runtimeConfig.public` chega ao navegador.
  A chave de API não pode.
- **Só a `entry` volta da rota.** O `verification.public_id` fica no seu banco.

## Limitações

`autenticar()` e `db` são stubs. Não há endpoint de webhook aqui — veja
[`pocs/webhook-receiver`](../../pocs/webhook-receiver).

## Referência

[Opções da SDK](https://documentacao.legitimuz.com/guides/web/sdk-options) ·
[Emitir a credencial](https://documentacao.legitimuz.com/guides/credential) ·
[Eventos](https://documentacao.legitimuz.com/guides/web/best-practices/events)
