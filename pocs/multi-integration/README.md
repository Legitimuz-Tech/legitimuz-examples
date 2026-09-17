# Várias integrações no mesmo backend

![Node 20](https://img.shields.io/badge/Node_20-5FA04E?logo=nodedotjs&logoColor=white&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=flat-square)

> Referência de implementação, não projeto executável.

[**Guia completo na doc →**](https://documentacao.legitimuz.com/guides/pocs/multi-integration)

Quem tem app e site, ou mais de uma marca, tem mais de uma integração. O backend é um só; a chave,
o fluxo e o segredo do webhook não.

## Arquivos

```
lib/canais.ts                     # o registro: três credenciais por canal
lib/assinatura.ts                 # a conferência, recebendo o segredo do canal
lib/stubs.ts                      # autenticar(), db e fila — substitua
app/api/verificacoes/route.ts     # resolve o canal antes de escolher a credencial
app/api/webhooks/[canal]/route.ts # um endpoint por canal
.env.example                      # as variáveis com sufixo por canal
```

## Onde cada arquivo entra

| Arquivo | Destino | Por quê |
| --- | --- | --- |
| `lib/canais.ts` | junto da sua config | mantém as três credenciais juntas por canal |
| `app/api/verificacoes/route.ts` | a sua rota de criação | mostra o canal vindo do cadastro |
| `app/api/webhooks/[canal]/route.ts` | a sua rota de webhook | o canal no caminho, não no corpo |

No dashboard, cada integração aponta o webhook dela para o seu caminho:
`https://seu-dominio/api/webhooks/site` e `https://seu-dominio/api/webhooks/app`.

## Envs

```bash
LEGITIMUZ_API_KEY_SITE=<SUA_CHAVE>
LEGITIMUZ_FLOW_ID_SITE=<FLOW_PUBLIC_ID>
LEGITIMUZ_WEBHOOK_SECRET_SITE=<SEGREDO_DO_ENDPOINT>

LEGITIMUZ_API_KEY_APP=<SUA_CHAVE>
LEGITIMUZ_FLOW_ID_APP=<FLOW_PUBLIC_ID>
LEGITIMUZ_WEBHOOK_SECRET_APP=<SEGREDO_DO_ENDPOINT>
```

## Pontos de atenção

- **Nunca deixe o cliente escolher o canal pelo corpo da requisição.** Quem manda o canal manda a
  chave usada, e com isso escolhe em qual conta a verificação nasce.
- **Canal desconhecido tem que falhar alto.** Um fallback silencioso cria verificação na conta
  errada e ninguém percebe.
- **Um endpoint por canal, não um endpoint com vários segredos.** Tentar cada segredo até um bater
  transforma uma falha de assinatura em algo indistinguível de um canal mal configurado.
- **As três credenciais andam juntas.** Trocar a chave sem trocar o segredo do webhook é o erro que
  só aparece na primeira entrega.

## Limitações

Canais fixos em código — com muitos canais, isso vira tabela e cache. Sem rotação de chave por
canal sem downtime. Sem métrica separada por canal.

## Referência

[Integrações](https://documentacao.legitimuz.com/platform/integrations) ·
[Cadastrar webhooks](https://documentacao.legitimuz.com/platform/webhooks) ·
[Segurança do webhook](https://documentacao.legitimuz.com/webhooks/security)
