# Retomada e expiração

![Next.js 15](https://img.shields.io/badge/Next.js_15-000000?logo=nextdotjs&logoColor=white&style=flat-square)
![idempotência](https://img.shields.io/badge/idempotência_por_ref__id-lightgrey?style=flat-square)

> Referência de implementação, não projeto executável.

[**Guia completo na doc →**](https://documentacao.legitimuz.com/guides/pocs/resume-expiry)

O caminho feliz é minoria. A maior parte dos chamados de integração vem do titular que abandonou,
voltou dois dias depois e encontrou uma tela quebrada.

## As três situações

| O que aconteceu | O que fazer |
| --- | --- |
| Voltou e a verificação ainda vale | repetir a criação com o mesmo `ref_id`: volta a existente |
| A verificação expirou | criar outra, com um `ref_id` novo |
| A verificação já decidiu | não criar nada: mostrar o desfecho |

## Arquivos

```
app/api/verificacoes/route.ts  # os três casos, numerados
lib/stubs.ts                   # autenticar() e db — substitua
package.json                   # referência de dependência, sem lockfile
.env.example                   # as três variáveis
```

## Onde cada arquivo entra

| Arquivo | Destino | Por quê |
| --- | --- | --- |
| `app/api/verificacoes/route.ts` | a sua rota de criação | substitui a criação ingênua das outras POCs |
| `lib/stubs.ts` | **não vai** | mostra as colunas que o seu cadastro precisa ter |

O seu cadastro precisa guardar `ref_id`, `expira_em` e `desfecho`. Sem as três, não há como decidir
qual dos casos é.

## Envs

```bash
LEGITIMUZ_API_KEY=<SUA_CHAVE>
LEGITIMUZ_WEBHOOK_SECRET=<SEGREDO_DO_ENDPOINT>
LEGITIMUZ_FLOW_ID=<FLOW_PUBLIC_ID>
```

## Pontos de atenção

- **O `ref_id` é único por conta.** Reaproveitá-lo depois da expiração com um corpo diferente
  responde `409 E_REF_ID_CONFLICT` — por isso o sufixo de tempo quando a jornada recomeça.
- **A criação repetida devolve o `status` de agora**, não o de quando foi criada. Quem está em
  `started` merece "continue de onde parou", não "comece agora".
- **O `expires_at` que você gravou já responde se a jornada vale.** Consultar a Legitimuz num
  intervalo para descobrir isso gasta o teto da chave e não traz nada que o webhook não traga.
- **Grave sempre o `ref_id` novo.** O webhook virá com ele, não com o antigo.

## Limitações

Sem limite de quantas vezes o mesmo cadastro pode recomeçar. Sem aviso ao titular de quanto tempo
resta. Sem tratamento de CPF trocado entre uma tentativa e outra.

## Referência

[Status da verificação](https://documentacao.legitimuz.com/api/verification-status) ·
[Criar verificação](https://documentacao.legitimuz.com/api/create-verification) ·
[Erros](https://documentacao.legitimuz.com/api/errors)
