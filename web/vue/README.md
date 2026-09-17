# Vue

![Vue 3](https://img.shields.io/badge/Vue_3-4FC08D?logo=vuedotjs&logoColor=white&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=flat-square)

> Referência de implementação, não projeto executável.

[**Guia completo na doc →**](https://documentacao.legitimuz.com/guides/web/vue)

O ciclo de vida do widget fica preso ao do componente: monta no `onMounted`, destrói no
`onUnmounted`. Mesma disciplina do hook React, com a API do Vue.

## Arquivos

```
index.html                  # a tag do CDN, antes do bundle
package.json                # referência de dependência, sem lockfile
.env.example                # a sdkUrl
src/
├── legitimuz.d.ts          # os tipos do global, declarados à mão
├── useLegitimuz.ts         # o composable: mount no onMounted, destroy no onUnmounted
└── VerificationWidget.vue  # o container com altura e os cinco callbacks
```

`src/main.ts`, `tsconfig.json` e `vite.config.ts` não estão aqui: são o scaffold padrão do Vite.

## Onde cada arquivo entra

| Arquivo | Destino | Por quê |
| --- | --- | --- |
| `index.html` | o `index.html` do Vite | a tag do CDN vai no `<head>`, antes do bundle |
| `src/legitimuz.d.ts` | qualquer lugar em `src/` | o build de CDN não traz tipos |
| `src/useLegitimuz.ts` | junto dos seus composables | encapsula o ciclo de vida e o `destroy()` |
| `src/VerificationWidget.vue` | junto dos seus componentes | o container com altura e o log |

## Envs

```bash
VITE_LEGITIMUZ_SDK_URL=<SUA_SDK_URL>
```

Gitignorado pelo padrão do Vite. Nunca commite um valor real.

## Pontos de atenção

- **O container precisa de altura.** O iframe ocupa 100% da altura dele.
- **`onUnmounted` chama `destroy()`.** Sem ele a stream de câmera sobrevive ao desmonte.
- **Só se você renderizar o custom element.** Os exemplos usam `mount()`, que monta num `<div>` e
  não pede configuração de compilador. O SDK também expõe `<legitimuz-websdk>`; **nesse caso** o
  Vue precisa ser avisado de que a tag não é um componente dele:

  ```ts
  vue({ template: { compilerOptions: { isCustomElement: (tag) => tag === "legitimuz-websdk" } } })
  ```

## Limitações

Não emite a `sdkUrl` — ela nasce no seu backend. Não trata o desfecho: a decisão chega ao seu
backend por webhook.

## Referência

[Opções da SDK](https://documentacao.legitimuz.com/guides/web/sdk-options) ·
[Eventos](https://documentacao.legitimuz.com/guides/web/best-practices/events) ·
[Erros](https://documentacao.legitimuz.com/guides/web/best-practices/errors)
