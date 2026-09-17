# Vanilla JS

> **Referência de implementação.** Este diretório mostra quais arquivos a integração exige e o que
> vai em cada um — não é um projeto executável.

**Página da doc:** [Vanilla JS](https://documentacao.legitimuz.com/guides/web/vanilla-js)

| | |
| --- | --- |
| **Stack** | HTML e JavaScript, sem npm e sem bundler |
| **Você terá** | o widget montado numa página estática, com os cinco callbacks ligados |

É a integração mínima. Se o widget funciona aqui, funciona em qualquer lugar onde um navegador
rode. Os outros exemplos de `web/` existem para mostrar que um framework não atrapalha.

## Árvore de arquivos

```
web/vanilla-js/
├── index.html         # o container com altura, a tag do CDN e o seu script
└── verificacao.js     # o mount() e os cinco callbacks
```

## Onde cada arquivo entra

| Arquivo | Onde vai no seu projeto | Por quê |
| --- | --- | --- |
| `index.html` | a página que hospeda a verificação | o `<script>` do CDN tem que vir **antes** do seu script: é ele que registra `window.Legitimuz` |
| `verificacao.js` | qualquer script carregado depois do CDN | o `mount()` é imperativo e roda uma vez |

## Variáveis de ambiente

Nenhuma. Sem bundler não há injeção de variável, então a `sdkUrl` é uma constante no topo de
`verificacao.js`. No seu projeto ela vem do seu backend em tempo de execução.

## Detalhes que não são óbvios

- **O container precisa de altura.** O iframe ocupa 100% da altura dele. Sem `height`, o widget
  monta e não aparece.
- **`localhost:8080`** é a única origem web que aceita porta na allowlist. Cadastre-a em
  Integrações → Segurança antes de abrir.
- **A câmera é bloqueada em `file://`** por alguns navegadores. Sirva a página por HTTP.
- **`handle.destroy()`** encerra o iframe e a stream de câmera. Sem ele, a câmera sobrevive à saída
  da página.

## O que este exemplo não faz

- Não emite a `sdkUrl`. Ela nasce no seu backend, em
  [emitir a credencial](https://documentacao.legitimuz.com/guides/credential).
- Não trata o desfecho. `onComplete` diz que o titular terminou de interagir, não que foi aprovado.
  A decisão chega ao seu backend por webhook.
- Não tem build, teste nem tratamento de erro além do log.

## Referência

- [Opções da SDK](https://documentacao.legitimuz.com/guides/web/sdk-options) — as 13 opções do `mount()`
- [Eventos](https://documentacao.legitimuz.com/guides/web/best-practices/events) — o catálogo e os payloads
- [Tratamento de erros](https://documentacao.legitimuz.com/guides/web/best-practices/errors) — os códigos
