# Ambiente local com túnel

![bash](https://img.shields.io/badge/bash-4EAA25?logo=gnubash&logoColor=white&style=flat-square)
![qualquer backend](https://img.shields.io/badge/qualquer_backend-lightgrey?style=flat-square)

> Referência de implementação, não projeto executável.

[**Guia completo na doc →**](https://documentacao.legitimuz.com/guides/pocs/local-tunnel)

O webhook precisa de um endereço público em HTTPS, e a sua máquina não tem um. Um túnel resolve, e
é o que separa "integrei" de "vi funcionar".

## Arquivos

```
criar-verificacao.sh   # cria uma verificação de teste e imprime a entry.url
.env.example           # as três variáveis
```

Este exemplo não traz servidor: use qualquer um de [`pocs/`](..). O que ele acrescenta é o roteiro
de fechar o ciclo localmente.

## O roteiro

**1. Levante o túnel.** Escolha um; os dois expõem a porta local num HTTPS público.

```bash
npx untun@latest tunnel http://localhost:3000
ngrok http 3000
```

**2. Aponte o webhook para ele.** Em Integrações → Segurança → Webhooks, crie um endpoint com
`https://<seu-tunel>/api/webhooks/legitimuz` e marque **Verificação decidida**. Copie o
`signing_secret` antes de fechar o diálogo — ele aparece uma vez só.

**3. Cadastre o domínio do widget.** O túnel serve o webhook; o **widget** abre na sua página
local. Em Domínios Autorizados, cadastre o host onde você abre o navegador.

**4. Feche o ciclo.** Dispare a entrega de teste pelo botão **Testar**, depois crie uma verificação
de verdade e percorra a jornada:

```bash
export LEGITIMUZ_API_KEY=... LEGITIMUZ_FLOW_ID=...
./criar-verificacao.sh <CPF_DE_TESTE>
```

Abra a `entry.url` no navegador e vá até o fim. O seu handler recebe `verification.decided` com o
`ref_id` que você mandou.

## Envs

```bash
LEGITIMUZ_API_KEY=<SUA_CHAVE>
LEGITIMUZ_WEBHOOK_SECRET=<SEGREDO_DO_ENDPOINT>
LEGITIMUZ_FLOW_ID=<FLOW_PUBLIC_ID>
```

## Pontos de atenção

- **O endereço do túnel muda a cada reinício** na maioria das ferramentas. Quando parar de chegar
  entrega, confira primeiro se o endpoint cadastrado ainda aponta para o túnel de agora.
- **Abra o painel em `localhost`, não em `127.0.0.1`.** São origens diferentes para o browser, e só
  uma delas vai estar na sua lista.
- **`localhost:8080`** é a única origem web que aceita porta na allowlist.

## Quando a entrega não chega

| Sintoma no dashboard | Causa provável |
| --- | --- |
| Erro de transporte | o túnel caiu, ou a URL cadastrada é a de outro dia |
| `401` no seu servidor | o segredo do `.env` não é o do endpoint que disparou |
| `419` ou `403` | middleware de CSRF na rota de webhook |
| `200` mas nada acontece | o corpo foi parseado antes da conferência |

A aba **Webhooks** da integração mostra cada tentativa com o código que o seu servidor devolveu. É
o primeiro lugar a olhar, antes do seu log.

## Limitações

Túnel gratuito costuma ter teto de requisição e latência alta. Sem endereço fixo: cada reinício
pede recadastro do endpoint. Não substitui um ambiente de homologação de verdade.

## Referência

[Primeira verificação](https://documentacao.legitimuz.com/guides/first-verification) ·
[Ir para produção](https://documentacao.legitimuz.com/start/production) ·
[Cadastrar webhooks](https://documentacao.legitimuz.com/platform/webhooks)
