# Remix

![React Router 7](https://img.shields.io/badge/React_Router_7-CA4245?logo=reactrouter&logoColor=white&style=flat-square)
![React 19](https://img.shields.io/badge/React_19-20232A?logo=react&logoColor=61DAFB&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=flat-square)

> Referência de implementação, não projeto executável.

[**Guia completo na doc →**](https://documentacao.legitimuz.com/guides/web/remix)

Loader no servidor, montagem no cliente. O `loader` emite a verificação e entrega só a `sdkUrl` ao
componente; o efeito do hook roda no browser, onde `window.Legitimuz` já existe porque o script
está no `root.tsx`.

## Arquivos

```
app/root.tsx                   # a tag do CDN, antes dos scripts do app
app/routes/verificacao.tsx     # o loader emite a credencial, o componente monta
app/hooks/useLegitimuz.ts      # mount no efeito, destroy no cleanup
app/hooks/legitimuz.d.ts       # os tipos do global
app/lib/stubs.ts               # autenticar() e db — substitua
package.json                   # referência de dependência, sem lockfile
.env.example                   # a chave e o fluxo, só no servidor
```

## Onde cada um entra

| Arquivo | Destino | Por quê |
| --- | --- | --- |
| `app/root.tsx` | o seu `root.tsx` | a tag do CDN vai no `<head>` |
| `app/routes/verificacao.tsx` | a rota que abre a verificação | mostra loader e componente no mesmo arquivo |
| `app/hooks/useLegitimuz.ts` | junto dos seus hooks | encapsula o efeito e o `destroy()` |
| `app/lib/stubs.ts` | **não vai** | é o contrato do que o seu código precisa oferecer |

## Envs

```bash
LEGITIMUZ_API_KEY=<SUA_CHAVE>
LEGITIMUZ_FLOW_ID=<FLOW_PUBLIC_ID>
```

Sem prefixo público. O `loader` roda só no servidor, então a chave nunca chega ao bundle.

## O que morde

- **O `loader` devolve a `sdkUrl`, não a resposta inteira.** Tudo que sai do loader vai serializado
  para o cliente: devolver `verification` junto mandaria o `public_id` para o browser sem
  necessidade.
- **A dependência do efeito é `[options.sdkUrl]`.** Remontar a cada render mataria a sessão.
- **O hook aqui devolve `{ containerRef, status }`**, um pouco diferente do
  [`web/react`](../react), que devolve só o ref. As duas formas montam igual.

## O que não faz

`autenticar()` e `db` são stubs. Não há endpoint de webhook — veja
[`pocs/webhook-receiver`](../../pocs/webhook-receiver).

## Referência

[Opções da SDK](https://documentacao.legitimuz.com/guides/web/sdk-options) ·
[Emitir a credencial](https://documentacao.legitimuz.com/guides/credential) ·
[Eventos](https://documentacao.legitimuz.com/guides/web/best-practices/events)
