# Web SDK

Nove exemplos, o mesmo widget. O que muda de um para outro é onde o script entra e como o
`mount()` é chamado.

## O que vale para todos

O SDK é carregado por CDN e registra `window.Legitimuz`. **Não há pacote npm para instalar.**

```html
<script src="https://sdk.legitimuz.com/v1/websdk.js"></script>
```

A URL `v1` é evergreen: serve sempre a última versão sem breaking change.

O mount é imperativo e devolve um handle:

```ts
const handle = window.Legitimuz.mount({ sdkUrl, target /* , ... */ });
handle.destroy();
```

`sdkUrl` é o embed URL que o seu backend recebe em `entry.url` ao chamar
[criar verificação](https://documentacao.legitimuz.com/api/create-verification). Ele carrega a
credencial da verificação no fragmento: trate como segredo, não registre em log e não mande para
analytics.

`target` precisa ter altura. O iframe ocupa 100% da altura do container, e sem altura o widget
existe na página sem aparecer.

## Tipos

O build de CDN não traz tipos. Cada exemplo em TypeScript carrega a própria cópia de
`src/legitimuz.d.ts`, e as cópias são iguais.

## Origem autorizada

Cadastre a origem em Integrações → Segurança. `localhost:8080` é a única origem web que aceita
porta, então é a porta que os exemplos usam.

## Os cinco callbacks

| Callback | Quando |
| --- | --- |
| `onReady` | a primeira tela está visível |
| `onEvent` | progresso da sessão |
| `onComplete` | o fluxo terminou, com `status` `"submitted"` ou `"abandoned"` |
| `onCancel` | o widget declarou cancelamento |
| `onError` | erro de configuração ou de fluxo |

Terminar não é ser aprovado. A decisão chega ao seu backend por webhook, nunca ao navegador.

O catálogo completo de opções está em
[opções da SDK](https://documentacao.legitimuz.com/guides/web/sdk-options).
