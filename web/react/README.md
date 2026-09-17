# React

![React 19](https://img.shields.io/badge/React_19-20232A?logo=react&logoColor=61DAFB&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=flat-square)

> Referência de implementação, não projeto executável.

[**Guia completo na doc →**](https://documentacao.legitimuz.com/guides/web/react)

O `mount()` é imperativo, então o único lugar onde ele cabe num app React é dentro de um efeito. É
uma porta estreita: o `<StrictMode>` invoca cada efeito duas vezes em desenvolvimento, e uma
montagem que não é idempotente monta o widget duas vezes ou destrói a sessão que acabou de criar.

## Arquivos

```
index.html                    # a tag do CDN, antes do bundle
package.json                  # referência de dependência, sem lockfile
.env.example                  # a sdkUrl
src/
├── legitimuz.d.ts            # os tipos do global, declarados à mão
├── useLegitimuz.ts           # o hook: mount no efeito, destroy no cleanup
├── VerificationWidget.tsx    # o container com altura
└── App.tsx                   # os cinco callbacks e o log
```

`src/main.tsx`, `tsconfig.json` e `vite.config.ts` não estão aqui: são o scaffold padrão do Vite.

## Onde cada um entra

| Arquivo | Destino | Por quê |
| --- | --- | --- |
| `index.html` | o `index.html` do Vite | a tag do CDN vai no `<head>`, antes do bundle |
| `src/legitimuz.d.ts` | qualquer lugar em `src/` | o build de CDN não traz tipos |
| `src/useLegitimuz.ts` | junto dos seus hooks | encapsula o efeito e o `destroy()` |
| `src/VerificationWidget.tsx` | junto dos seus componentes | isola a altura obrigatória do container |
| `src/App.tsx` | a tela que abre a verificação | mostra os cinco callbacks ligados |

## Envs

```bash
VITE_LEGITIMUZ_SDK_URL=<SUA_SDK_URL>
```

O `.env` fica fora do controle de versão. A `sdkUrl` carrega a credencial da verificação no
fragmento: nunca commite um valor real.

## O que morde

- **A dependência do efeito é `[options.sdkUrl]`, não `[options]`.** Depender do objeto remontaria
  o widget a cada render e mataria a sessão em andamento.
- **O cleanup chama `destroy()`.** Sem ele, com `<StrictMode>`, aparecem dois iframes e a câmera
  sobrevive ao unmount.
- **O container precisa de altura.** É por isso que `VerificationWidget.tsx` existe.

## O que não faz

Não emite a `sdkUrl` — ela nasce no seu backend. Não trata o desfecho: a decisão chega ao seu
backend por webhook, nunca ao navegador.

## Referência

[Opções da SDK](https://documentacao.legitimuz.com/guides/web/sdk-options) ·
[Eventos](https://documentacao.legitimuz.com/guides/web/best-practices/events) ·
[Erros](https://documentacao.legitimuz.com/guides/web/best-practices/errors)
