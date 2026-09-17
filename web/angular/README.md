# Angular

![Angular](https://img.shields.io/badge/Angular-DD0031?logo=angular&logoColor=white&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=flat-square)
![standalone](https://img.shields.io/badge/standalone-lightgrey?style=flat-square)

> Referência de implementação, não projeto executável.

[**Guia completo na doc →**](https://documentacao.legitimuz.com/guides/web/angular)

Um componente standalone encapsula o widget e reexpõe os cinco callbacks como `@Output`. É o único
arquivo do app que toca em `window.Legitimuz`.

## Arquivos

```
src/index.html                             # a tag do CDN
src/app/legitimuz.d.ts                     # os tipos do global
src/app/verification-widget.component.ts   # mount no ngAfterViewInit, destroy no ngOnDestroy
src/app/app.component.ts                   # consome os @Output e monta o log
src/environments/environment.ts            # a sdkUrl
package.json                               # referência de dependência, sem lockfile
```

## Onde cada um entra

| Arquivo | Destino | Por quê |
| --- | --- | --- |
| `src/index.html` | o `index.html` do Angular | a tag do CDN registra o global |
| `src/app/legitimuz.d.ts` | junto dos seus tipos | o build de CDN não traz tipos |
| `src/app/verification-widget.component.ts` | junto dos seus componentes | isola o acesso ao global |
| `src/environments/environment.ts` | o seu environment | Angular não lê `.env` |

## Envs

Nenhuma. Angular não lê `.env`: a configuração vai no arquivo de environment, trocado no build por
`fileReplacements`.

Numa integração real o environment aponta o endereço do **seu backend**, não guarda uma `sdkUrl` —
ela é emitida por verificação, em tempo de execução.

## O que morde

- **Monte em `ngAfterViewInit`, não em `ngOnInit`.** O `@ViewChild` só existe depois que a view foi
  criada; em `ngOnInit` o `<div>` ainda não está lá.
- **`ngOnDestroy` chama `destroy()`.** Sem ele a câmera sobrevive à troca de rota.
- **Só se você renderizar o custom element.** O componente monta num `<div>` via `mount()` e não
  pede schema. Para usar `<legitimuz-websdk>` declarativamente, adicione
  `schemas: [CUSTOM_ELEMENTS_SCHEMA]` **no componente que usa a tag**, não no app inteiro.

## O que não faz

Não emite a `sdkUrl` — ela nasce no seu backend. Não trata o desfecho: a decisão chega ao seu
backend por webhook.

## Referência

[Opções da SDK](https://documentacao.legitimuz.com/guides/web/sdk-options) ·
[Eventos](https://documentacao.legitimuz.com/guides/web/best-practices/events) ·
[Erros](https://documentacao.legitimuz.com/guides/web/best-practices/errors)
