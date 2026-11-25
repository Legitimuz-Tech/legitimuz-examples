# Verificação de empresa (KYB)

![Node 20](https://img.shields.io/badge/Node_20-5FA04E?logo=nodedotjs&logoColor=white&style=flat-square)
![Express 5](https://img.shields.io/badge/Express_5-000000?logo=express&logoColor=white&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=flat-square)

> Referência de implementação, não projeto executável.

[**Guia completo na doc →**](https://documentacao.legitimuz.com/guides/pocs/kyb-onboarding)

O cadastro de uma empresa de ponta a ponta: a rota que cria a verificação pelo CNPJ, o tratamento
da empresa barrada na criação e o endpoint que recebe o desfecho do sócio.

## Arquivos

```
server.ts    # as duas rotas
signature.ts # conferência do X-Legitimuz-Signature
stubs.ts     # authenticate() e db — substitua tudo
package.json # referência de dependência, sem lockfile
.env.example # as três variáveis
```

## Onde cada arquivo entra

| Arquivo | Destino | Por quê |
| --- | --- | --- |
| `server.ts` | junto das suas rotas | a criação por CNPJ e o webhook, com o middleware certo em cada uma |
| `signature.ts` | uma pasta de utilitários | a conferência é a mesma em qualquer framework Node |
| `stubs.ts` | **não vai** | é o contrato do que o seu código precisa oferecer |

## Envs

```bash
LEGITIMUZ_API_KEY=<SUA_CHAVE>
LEGITIMUZ_WEBHOOK_SECRET=<SEGREDO_DO_ENDPOINT>
LEGITIMUZ_FLOW_ID=<FLOW_PUBLIC_ID>
```

Integrações → Segurança para as duas primeiras, Solução KYC → Fluxos para a terceira. Use uma
integração **sandbox**; nenhuma das três vai para o browser.

## Pontos de atenção

- **O CNPJ vem do seu cadastro, nunca do corpo da requisição.** Se o cliente escolhe o documento,
  qualquer um cria verificação para qualquer empresa na sua conta.
- **A empresa pode ser barrada na criação.** A resposta é `201` com `verification.status` igual a
  `reproved` e o motivo em `business.impediment`. Trate como desfecho: não há jornada para abrir. O
  `verification.decided` chega em seguida com o mesmo status.
- **`503 E_BUSINESS_LOOKUP_UNAVAILABLE` não cria nada.** A consulta da empresa não respondeu; repita
  a chamada com backoff.
- **O sócio é escolhido dentro da jornada.** O seu servidor não manda CPF nenhum.
- **O desfecho chega por `verification.decided`, com `kind` igual a `kyb`.** É o resultado da
  verificação de identidade do sócio.
- **Qualquer fluxo publicado da integração serve.** Não existe um tipo de fluxo próprio para empresa.
- **Deduplique pelo `X-Legitimuz-Delivery`.** A entrega é reenviada e a ordem não é garantida.

## Limitações

`authenticate()` e `db` são stubs sem implementação real. Sem migration, observabilidade ou
retentativa própria. Fora o `503`, o `response.ok` não é conferido, para o exemplo caber numa tela —
no seu código, confira.

## Referência

[Verificar uma empresa](https://documentacao.legitimuz.com/guides/kyb) ·
[Criar verificação](https://documentacao.legitimuz.com/api/create-verification) ·
[Segurança do webhook](https://documentacao.legitimuz.com/webhooks/security) ·
[Eventos](https://documentacao.legitimuz.com/webhooks/events)
