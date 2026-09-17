# Backend em Go

![Go 1.23](https://img.shields.io/badge/Go_1.23-00ADD8?logo=go&logoColor=white&style=flat-square)
![stdlib](https://img.shields.io/badge/biblioteca_padrão-lightgrey?style=flat-square)

> Referência de implementação, não projeto executável.

[**Guia completo na doc →**](https://documentacao.legitimuz.com/guides/pocs/go-backend)

A integração sem framework: `net/http` e `crypto/hmac` dão conta das duas pontas.

## Arquivos

```
main.go           # registra as duas rotas
verificacao.go    # POST /api/verificacoes
webhook.go        # POST /api/webhooks/legitimuz, com a assinatura conferida
stubs.go          # autenticar(), db e fila — substitua tudo
go.mod            # sem dependência externa
.env.example      # as três variáveis
```

## Onde cada um entra

| Arquivo | Destino | Por quê |
| --- | --- | --- |
| `verificacao.go` | junto dos seus handlers | a chamada de criação e o struct de resposta |
| `webhook.go` | junto dos seus handlers | `assinaturaValida` serve para qualquer roteador |
| `main.go` | o seu `main` | mostra os dois padrões de rota do `net/http` 1.22+ |
| `stubs.go` | **não vai** | é o contrato do que o seu código precisa oferecer |

## Envs

```bash
LEGITIMUZ_API_KEY=<SUA_CHAVE>
LEGITIMUZ_WEBHOOK_SECRET=<SEGREDO_DO_ENDPOINT>
LEGITIMUZ_FLOW_ID=<FLOW_PUBLIC_ID>
```

## O que morde

- **`io.LimitReader` não é decoração.** Sem teto, um corpo grande no seu endpoint público vira
  consumo de memória sem limite.
- **Leia os bytes antes de decodificar.** Um `json.NewDecoder(r.Body)` consumiria o corpo antes da
  conferência da assinatura.
- **`hmac.Equal`**, não `==`: comparação em tempo constante.
- **A tolerância é nos dois sentidos.** O relógio do seu servidor pode estar adiantado, por isso a
  comparação testa `d > tolerancia || d < -tolerancia`.

## O que não faz

`db` e `fila` são variáveis de pacote fictícias. Sem `context` de cancelamento no worker e sem
retry na criação — o catálogo de quando repetir está em
[erros](https://documentacao.legitimuz.com/api/errors).

## Referência

[Emitir a credencial](https://documentacao.legitimuz.com/guides/credential) ·
[Criar verificação](https://documentacao.legitimuz.com/api/create-verification) ·
[Segurança do webhook](https://documentacao.legitimuz.com/webhooks/security)
