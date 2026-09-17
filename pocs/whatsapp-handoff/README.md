# Enviar a verificação por WhatsApp

![Node 20](https://img.shields.io/badge/Node_20-5FA04E?logo=nodedotjs&logoColor=white&style=flat-square)
![WhatsApp Cloud API](https://img.shields.io/badge/WhatsApp_Cloud_API-25D366?logo=whatsapp&logoColor=white&style=flat-square)

> Referência de implementação, não projeto executável.

[**Guia completo na doc →**](https://documentacao.legitimuz.com/guides/pocs/whatsapp-handoff)

O titular não está na sua tela: está num call center, num cadastro por telefone, ou abandonou o
formulário ontem. O WhatsApp entrega a jornada no aparelho que tem a câmera boa.

## A credencial não vai na mensagem

A `entry.url` carrega o acesso à jornada, e uma mensagem fica no histórico do aparelho, do WhatsApp
Web aberto no computador da loja, e do backup em nuvem. Então o que viaja é um **link curto do seu
domínio**, que só o seu servidor sabe trocar pela `entry.url`.

Isso também é o que o template de botão da Meta permite: a URL base é fixa e aprovada, e só o
sufixo é variável.

## Arquivos

```
app/api/verificacoes/whatsapp/route.ts  # cria a verificação, guarda a url, despacha o token
app/v/[token]/route.ts                  # troca o token pela entry.url, com 302
lib/whatsapp.ts                         # o envio do template pela Cloud API
lib/stubs.ts                            # autenticar(), db.cadastros e db.links — substitua
package.json                            # referência de dependência, sem lockfile
.env.example                            # as três variáveis + as credenciais da Meta
```

## Onde cada um entra

| Arquivo | Destino | Por quê |
| --- | --- | --- |
| `app/api/verificacoes/whatsapp/route.ts` | a sua rota de despacho | a `entry.url` para no banco, não na mensagem |
| `app/v/[token]/route.ts` | uma rota pública curta | o redirecionamento é do servidor |
| `lib/whatsapp.ts` | junto das suas integrações | o formato do template com botão de URL |
| `lib/stubs.ts` | **não vai** | mostra as colunas que a tabela `links` precisa |

## O template na Meta

```text
Nome:   verificacao_identidade
Corpo:  Olá, {{1}}! Para concluir seu cadastro, confirme sua identidade. O link vale por 24 horas
        e é só para você.
Botão:  URL dinâmica — https://seu-dominio/v/{{1}}
```

## Envs

```bash
LEGITIMUZ_API_KEY=<SUA_CHAVE>
LEGITIMUZ_WEBHOOK_SECRET=<SEGREDO_DO_ENDPOINT>
LEGITIMUZ_FLOW_ID=<FLOW_PUBLIC_ID>
WHATSAPP_PHONE_ID=<ID_DO_NUMERO>
WHATSAPP_TOKEN=<TOKEN_DA_APP>
```

## O que morde

- **Não devolva a `entry.url` em JSON para o front redirecionar.** Isso coloca a credencial no
  histórico de rede do navegador e em qualquer extensão instalada. O redirecionamento é do servidor,
  com `302` e `Cache-Control: no-store`.
- **`consumir` é um `UPDATE` condicional**, não `SELECT` seguido de `UPDATE`. Dois cliques
  simultâneos no mesmo link não podem resolver os dois. A tabela `links` precisa de índice único em
  `token`.
- **O telefone vem do cadastro**, nunca do corpo da requisição.
- **Não registre a resposta crua da Meta em log**: ela repete o telefone do titular.

## Antes de enviar para gente de verdade

| Regra | Por quê |
| --- | --- |
| Só para número já verificado no seu cadastro | quem escolhe o número escolhe o destinatário da jornada |
| Só com opt-in registrado | mensagem iniciada pela empresa exige consentimento, e a Meta bloqueia quem ignora |
| Nunca em grupo ou lista de transmissão | a jornada é de uma pessoa; grupo entrega a credencial a todas |
| Um envio por verificação, com limite de reenvio | reenvio sem teto vira vetor de assédio e custo |

## O que não faz

Sem webhook de status do WhatsApp: você não sabe se a mensagem foi lida. Sem fallback para SMS. Sem
rate limit por cadastro no reenvio. Sem migration para a tabela `links`.

## Referência

[QR code](https://documentacao.legitimuz.com/guides/pocs/qr-handoff) ·
[Criar verificação](https://documentacao.legitimuz.com/api/create-verification) ·
[Dados e privacidade](https://documentacao.legitimuz.com/help/data-and-privacy)
