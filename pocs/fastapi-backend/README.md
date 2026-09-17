# Backend em FastAPI

![Python 3.12](https://img.shields.io/badge/Python_3.12-3776AB?logo=python&logoColor=white&style=flat-square)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white&style=flat-square)
![httpx](https://img.shields.io/badge/httpx-lightgrey?style=flat-square)

> Referência de implementação, não projeto executável.

[**Guia completo na doc →**](https://documentacao.legitimuz.com/guides/pocs/fastapi-backend)

A mesma integração do [Express](../express-backend), em Python. O que muda é como o framework
entrega o corpo cru ao handler de webhook.

## Arquivos

```
main.py             # POST /api/verificacoes
webhooks.py         # POST /api/webhooks/legitimuz, com a assinatura conferida
stubs.py            # autenticar(), db e fila — substitua tudo
requirements.txt    # referência de dependência
.env.example        # as três variáveis
```

## Onde cada arquivo entra

| Arquivo | Destino | Por quê |
| --- | --- | --- |
| `main.py` | junto das suas rotas | a chamada de criação e o `Depends(autenticar)` |
| `webhooks.py` | junto das suas rotas | a conferência precisa do corpo em bytes |
| `stubs.py` | **não vai** | é o contrato do que o seu código precisa oferecer |

## Envs

```bash
LEGITIMUZ_API_KEY=<SUA_CHAVE>
LEGITIMUZ_WEBHOOK_SECRET=<SEGREDO_DO_ENDPOINT>
LEGITIMUZ_FLOW_ID=<FLOW_PUBLIC_ID>
```

## Pontos de atenção

- **Não declare o corpo do webhook como modelo Pydantic.** O FastAPI faria o parse, o
  `request.body()` viria vazio ou reserializado, e a conferência falharia em toda entrega.
- **A string assinada é `t.corpo` em bytes.** Aqui ela é montada como
  `f"{timestamp}.".encode() + corpo_cru`, sem decodificar o corpo — decodificar e recodificar pode
  alterar bytes.
- **`hmac.compare_digest`**, não `==`: comparação em tempo constante.
- **O CPF vem do seu cadastro**, nunca do corpo da requisição.

## Limitações

`autenticar` é uma dependência simulada, `db` e `fila` são stubs. Sem retry na criação — o
catálogo de quando repetir está em [erros](https://documentacao.legitimuz.com/api/errors). Sem
migration e sem observabilidade.

## Referência

[Emitir a credencial](https://documentacao.legitimuz.com/guides/credential) ·
[Criar verificação](https://documentacao.legitimuz.com/api/create-verification) ·
[Segurança do webhook](https://documentacao.legitimuz.com/webhooks/security)
