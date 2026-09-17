# React

> **Referência de implementação.** Este diretório mostra quais arquivos a integração exige e o que
> vai em cada um — não é um projeto executável.

**Página da doc:** [React](https://documentacao.legitimuz.com/guides/web/react)

| | |
| --- | --- |
| **Stack** | React 19 · Vite · TypeScript |
| **Você terá** | um hook que monta o widget uma vez por `sdkUrl`, mesmo com `<StrictMode>` |

O `mount()` é imperativo, então o único lugar onde ele cabe num app React é dentro de um efeito. É
uma porta estreita: o `<StrictMode>` invoca cada efeito duas vezes em desenvolvimento, e uma
montagem que não é idempotente monta o widget duas vezes ou destrói a sessão que acabou de criar.

## Árvore de arquivos

```
web/react/
├── index.html                    # a tag do CDN, antes do bundle
├── package.json                  # referência de dependência, sem lockfile
├── .env.example                  # a sdkUrl
└── src/
    ├── legitimuz.d.ts            # os tipos do global, declarados à mão
    ├── useLegitimuz.ts           # o hook: mount no efeito, destroy no cleanup
    ├── VerificationWidget.tsx    # o container com altura
    └── App.tsx                   # os cinco callbacks e o log
```

`src/main.tsx` não está aqui: é o bootstrap padrão do Vite, que o seu projeto já tem.

## Onde cada arquivo entra

| Arquivo | Onde vai no seu projeto | Por quê |
| --- | --- | --- |
| `index.html` | o `index.html` do Vite | a tag do CDN vai no `<head>`, antes do bundle |
| `src/legitimuz.d.ts` | qualquer lugar em `src/` | o build de CDN não traz tipos |
| `src/useLegitimuz.ts` | junto dos seus hooks | encapsula o efeito e o `destroy()` |
| `src/VerificationWidget.tsx` | junto dos seus componentes | isola a altura obrigatória do container |
| `src/App.tsx` | a tela que abre a verificação | mostra os cinco callbacks ligados |

## Variáveis de ambiente

```bash
VITE_LEGITIMUZ_SDK_URL=<SUA_SDK_URL>
```

O `.env` fica fora do controle de versão. A `sdkUrl` carrega a credencial da verificação no
fragmento: nunca commite um valor real.

## Detalhes que não são óbvios

- **A dependência do efeito é `[options.sdkUrl]`, não `[options]`.** Assim o widget monta uma vez
  por sessão e permanece estável entre renders, mesmo quando o objeto de opções é recriado pelo pai.
  Depender do objeto remontaria o widget a cada render e mataria a sessão em andamento.
- **O cleanup chama `destroy()`.** Sem ele, com `<StrictMode>`, aparecem dois iframes e a câmera
  sobrevive ao unmount.
- **O container precisa de altura.** Está em `VerificationWidget.tsx`, por isso o componente existe.

## O que este exemplo não faz

- Não emite a `sdkUrl`. Ela nasce no seu backend, em
  [emitir a credencial](https://documentacao.legitimuz.com/guides/credential).
- Não trata o desfecho. A decisão chega ao seu backend por webhook, nunca ao navegador.
- Não traz `src/main.tsx`, `tsconfig.json` nem `vite.config.ts`: são o scaffold padrão do Vite.

## Referência

- [Opções da SDK](https://documentacao.legitimuz.com/guides/web/sdk-options) — as 13 opções do `mount()`
- [Eventos](https://documentacao.legitimuz.com/guides/web/best-practices/events) — o catálogo e os payloads
- [Tratamento de erros](https://documentacao.legitimuz.com/guides/web/best-practices/errors) — os códigos
