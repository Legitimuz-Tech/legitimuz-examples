# O padrão

Este repo é um catálogo de referência. Todo diretório de exemplo segue as regras abaixo, para que
quem leu um consiga ler qualquer outro sem reaprender.

## 1. Um exemplo por página da doc, no mesmo caminho

O slug do diretório é o slug da página. `/guides/web/react` vira `web/react/`. Exemplo sem página,
ou página sem exemplo, é defeito: corrija dos dois lados.

## 2. Os arquivos ficam no caminho real do projeto de destino

`src/App.tsx`, `app/api/verificacoes/route.ts`, `server.ts`. Não invente uma pasta `exemplo/` nem
achate tudo na raiz: o caminho é metade da informação que o exemplo entrega.

## 3. O `README.md` tem sempre as mesmas seções, nesta ordem

1. `#` com o mesmo título da página da doc.
2. A citação de aviso: referência de implementação, não projeto executável.
3. **Página da doc** — o link.
4. **Stack** — copiada da página.
5. **Árvore de arquivos** — com um comentário de uma linha por arquivo.
6. **Onde cada arquivo entra** — tabela arquivo → destino → por quê.
7. **Variáveis de ambiente** — quando houver.
8. **O que este exemplo não faz** — os limites, explícitos.
9. **Referência** — links para a doc.

## 4. Nada de segredo, nada de dado real

Placeholder em maiúscula entre `<>`: `<SUA_CHAVE>`. Nunca uma chave, um CPF, um nome de cliente ou
um print com dado de titular. O repo é público e o histórico do git não se apaga.

CPF de exemplo usa máscara neutra: `000.000.000-00`.

## 5. Stub é stub, e fica num arquivo só

`autenticar()`, `db` e `fila` não são implementados aqui. Ficam em `stubs.ts` (ou equivalente),
marcados com `// Substitua pela sua implementação.` É onde o código do integrador encaixa, e
deixar isso visível é parte do que o exemplo ensina.

## 6. Os exemplos web têm a mesma casca

Container com altura, uma linha de status, uma lista de eventos. O que muda entre React, Vue e
Svelte é **como o `mount()` é chamado**, não o desenho da tela. É isso que transforma o diretório
`web/` num comparativo.

## 7. Os backends expõem as mesmas duas rotas

`POST /api/verificacoes` e `POST /api/webhooks/legitimuz`, com os mesmos nomes em todas as
linguagens.

## 8. `src/legitimuz.d.ts` é idêntico em todos os exemplos web

O build de CDN não traz tipos, então cada exemplo carrega a própria cópia. As cópias são iguais
byte a byte. Mudou uma, mude todas.

## 9. Sem lockfile, sem build

`package.json` entra como referência de dependência. `package-lock.json`, `node_modules/` e `dist/`
não entram — o `.gitignore` já barra.

## De onde sai a verdade

Nome de opção, nome de evento, código de erro e assinatura pública saem do produto, nunca da
memória:

| Assunto | Fonte |
| --- | --- |
| Opções do `mount()`, eventos, erros `6xxx` | a página [opções da SDK](https://documentacao.legitimuz.com/guides/web/sdk-options) |
| `POST /public/verifications` | [criar verificação](https://documentacao.legitimuz.com/api/create-verification) |
| Assinatura do webhook | [segurança](https://documentacao.legitimuz.com/webhooks/security) |
| SDKs mobile | os `README.md` dos repos das SDKs |

Valor que você não confirmou vira `TODO`, não suposição.
