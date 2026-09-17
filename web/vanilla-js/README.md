# Vanilla JS

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white&style=flat-square)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black&style=flat-square)
![sem build](https://img.shields.io/badge/sem_build-lightgrey?style=flat-square)

> Referência de implementação, não projeto executável.

[**Guia completo na doc →**](https://documentacao.legitimuz.com/guides/web/vanilla-js)

A integração mínima. Se o widget funciona aqui, funciona em qualquer lugar onde um navegador rode.

## Arquivos

```
index.html        # o container com altura, a tag do CDN e o seu script
verificacao.js    # o mount() e os cinco callbacks
```

## Onde cada um entra

| Arquivo | Destino | Por quê |
| --- | --- | --- |
| `index.html` | a página que hospeda a verificação | o `<script>` do CDN vem **antes** do seu: é ele que registra `window.Legitimuz` |
| `verificacao.js` | qualquer script carregado depois do CDN | o `mount()` é imperativo e roda uma vez |

## Variáveis

Nenhuma. Sem bundler não há injeção, então a `sdkUrl` é uma constante no topo de `verificacao.js`.
No seu projeto ela vem do backend em tempo de execução.

## O que morde

- **O container precisa de altura.** O iframe ocupa 100% da altura dele. Sem `height`, o widget
  monta e não aparece.
- **`localhost:8080`** é a única origem web que aceita porta na allowlist.
- **A câmera é bloqueada em `file://`.** Sirva por HTTP.
- **`handle.destroy()`** encerra o iframe e a stream de câmera.

## O que não faz

Não emite a `sdkUrl` — ela nasce no seu backend. Não trata o desfecho: `onComplete` diz que o
titular terminou de interagir, não que foi aprovado. Sem build e sem teste.

## Referência

[Opções da SDK](https://documentacao.legitimuz.com/guides/web/sdk-options) ·
[Eventos](https://documentacao.legitimuz.com/guides/web/best-practices/events) ·
[Erros](https://documentacao.legitimuz.com/guides/web/best-practices/errors)
