# Backend e padrões de integração

Doze exemplos: quatro backends que fazem a mesma coisa em linguagens diferentes, e oito padrões de
integração que aparecem depois que o básico funciona.

## As duas rotas

Todos os backends expõem as mesmas duas, com os mesmos nomes, para você comparar linguagem e não
arquitetura.

| Rota | O que faz |
| --- | --- |
| `POST /api/verificacoes` | autentica o seu usuário, chama a Legitimuz e devolve **só** a `entry` |
| `POST /api/webhooks/legitimuz` | confere a assinatura, descarta repetição e enfileira |

## O que nunca sai do servidor

A chave de API (`lz_...`) e o segredo do webhook. O cliente recebe a `entry` e nada mais. Nunca
deixe o titular escolher o CPF: ele vem do seu cadastro.

## A assinatura do webhook

O header é `X-Legitimuz-Signature: t=<unix>,v1=<hmac-sha256-hex>`. A string assinada é
`` `${timestamp}.${corpo cru}` ``, com tolerância de 300 segundos e comparação em tempo constante.

Precisa do **corpo cru**, byte a byte. Um parser de JSON global antes da rota de webhook consome o
corpo e a conferência passa a falhar sempre.

## Stubs

`autenticar()`, `db` e `fila` são stubs em todos os exemplos, num arquivo separado. É onde o seu
código entra. Nenhum exemplo traz migration, observabilidade ou retentativa própria.

Detalhes em [segurança do webhook](https://documentacao.legitimuz.com/webhooks/security).
