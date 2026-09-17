# Next.js

![Next.js 15](https://img.shields.io/badge/Next.js_15-000000?logo=nextdotjs&logoColor=white&style=flat-square)
![React 19](https://img.shields.io/badge/React_19-20232A?logo=react&logoColor=61DAFB&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=flat-square)

> Referência de implementação, não projeto executável.

[**Guia completo na doc →**](https://documentacao.legitimuz.com/guides/web/next-js)

O App Router renderiza no servidor, onde `window` não existe. Duas coisas resolvem isso, e a
segunda costuma passar despercebida: o script precisa carregar com `beforeInteractive`, e o
componente do widget precisa ser Client Component.

## Arquivos

```
app/layout.tsx                   # <Script beforeInteractive> — só funciona aqui
app/page.tsx                     # continua Server Component
components/VerificationWidget.tsx  # "use client" na primeira linha
types/legitimuz.d.ts             # os tipos do global
package.json                     # referência de dependência, sem lockfile
.env.local.example               # a sdkUrl, com prefixo NEXT_PUBLIC_
```

## Onde cada arquivo entra

| Arquivo | Destino | Por quê |
| --- | --- | --- |
| `app/layout.tsx` | o seu root layout | `beforeInteractive` só é aceito no layout raiz |
| `components/VerificationWidget.tsx` | junto dos seus componentes | isola o `"use client"` num arquivo só |
| `app/page.tsx` | a rota que abre a verificação | mostra a página permanecendo no servidor |
| `types/legitimuz.d.ts` | `types/` ou `src/types/` | o build de CDN não traz tipos |

## Envs

```bash
NEXT_PUBLIC_LEGITIMUZ_SDK_URL=<SUA_SDK_URL>
```

O prefixo `NEXT_PUBLIC_` é obrigatório: sem ele o valor não chega ao navegador.

Numa integração real a `sdkUrl` **não** vem de variável de ambiente — ela é emitida por
verificação. Busque-a num Server Component ou numa Route Handler e passe como prop. A variável aqui
existe só para o exemplo caber numa tela.

## Pontos de atenção

- **`"use client"` tem que ser a primeira linha do arquivo.** Um prólogo de diretiva não pode vir
  depois de um comentário. Com um comentário acima, a diretiva é ignorada em silêncio e o
  componente tenta renderizar no servidor.
- **`beforeInteractive` só vale em `app/layout.tsx`.** Em qualquer outro lugar o Next ignora a
  estratégia. Se a sua arquitetura pede `afterInteractive`, condicione a montagem a um estado que o
  `onLoad` do `<Script>` ativa.
- **A dependência do efeito é `[sdkUrl]`.** Remontar a cada mudança de opção mataria a sessão.

## Limitações

Não emite a `sdkUrl` — veja [`pocs/next-checkout`](../../pocs/next-checkout) para a rota que a
emite. Não trata o desfecho: a decisão chega ao seu backend por webhook.

## Referência

[Opções da SDK](https://documentacao.legitimuz.com/guides/web/sdk-options) ·
[Eventos](https://documentacao.legitimuz.com/guides/web/best-practices/events) ·
[Erros](https://documentacao.legitimuz.com/guides/web/best-practices/errors)
