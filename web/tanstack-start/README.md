# TanStack Start

![TanStack](https://img.shields.io/badge/TanStack_Start-FF4154?logo=reactquery&logoColor=white&style=flat-square)
![React 19](https://img.shields.io/badge/React_19-20232A?logo=react&logoColor=61DAFB&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=flat-square)

> Referência de implementação, não projeto executável.

[**Guia completo na doc →**](https://documentacao.legitimuz.com/guides/web/tanstack-start)

Mesma divisão do [Remix](../remix), com a API do TanStack: uma server function emite a verificação,
o `loader` da rota a chama, e o componente monta o widget no cliente.

## Arquivos

```
src/routes/__root.tsx             # o script no head da rota raiz
src/routes/verificacao.tsx        # o loader chama a server function, o componente monta
src/server/criar-verificacao.ts   # a server function que emite a credencial
src/hooks/useLegitimuz.ts         # mount no efeito, destroy no cleanup
src/hooks/legitimuz.d.ts          # os tipos do global
src/lib/stubs.ts                  # autenticar() e db — substitua
package.json                      # referência de dependência, sem lockfile
.env.example                      # a chave e o fluxo, só no servidor
```

## Onde cada arquivo entra

| Arquivo | Destino | Por quê |
| --- | --- | --- |
| `src/routes/__root.tsx` | a sua rota raiz | o script vai no `head` da rota, não num HTML |
| `src/server/criar-verificacao.ts` | junto das suas server functions | a chave só existe aqui |
| `src/routes/verificacao.tsx` | a rota que abre a verificação | liga `loader` e componente |
| `src/hooks/useLegitimuz.ts` | junto dos seus hooks | encapsula o efeito e o `destroy()` |
| `src/lib/stubs.ts` | **não vai** | é o contrato do que o seu código precisa oferecer |

## Envs

```bash
LEGITIMUZ_API_KEY=<SUA_CHAVE>
LEGITIMUZ_FLOW_ID=<FLOW_PUBLIC_ID>
```

Sem prefixo público. A server function roda só no servidor.

## Pontos de atenção

- **O script vai no `head` da rota raiz**, via `createRootRoute({ head })`, não num `index.html`.
- **A server function devolve só a `sdkUrl`.** O que ela retorna atravessa para o cliente.
- **A dependência do efeito é `[options.sdkUrl]`.**

## Limitações

`autenticar()` e `db` são stubs. Não há endpoint de webhook — veja
[`pocs/webhook-receiver`](../../pocs/webhook-receiver).

## Referência

[Opções da SDK](https://documentacao.legitimuz.com/guides/web/sdk-options) ·
[Emitir a credencial](https://documentacao.legitimuz.com/guides/credential) ·
[Eventos](https://documentacao.legitimuz.com/guides/web/best-practices/events)
