# Backend em Laravel

![PHP 8.3](https://img.shields.io/badge/PHP_8.3-777BB4?logo=php&logoColor=white&style=flat-square)
![Laravel 11](https://img.shields.io/badge/Laravel_11-FF2D20?logo=laravel&logoColor=white&style=flat-square)

> Referência de implementação, não projeto executável.

[**Guia completo na doc →**](https://documentacao.legitimuz.com/guides/pocs/laravel-backend)

A integração num projeto PHP. O ponto de atenção é o middleware: a rota de webhook precisa ficar
fora do `VerifyCsrfToken` e receber o corpo sem transformação.

## Arquivos

```
app/Http/Controllers/VerificacaoController.php   # POST /api/verificacoes
app/Http/Controllers/WebhookController.php       # POST /api/webhooks/legitimuz
app/Models/Entrega.php                           # deduplicação por delivery_id
app/Jobs/ProcessarDesfecho.php                   # job vazio — a lógica é sua
config/services.php                              # o bloco legitimuz
routes/web.php                                   # as duas rotas e o withoutMiddleware
database/migrations/..._create_entregas_table.php  # o índice único que faz a dedup funcionar
.env.example                                     # as três variáveis
```

## Onde cada arquivo entra

| Arquivo | Destino | Por quê |
| --- | --- | --- |
| `VerificacaoController.php` | `app/Http/Controllers/` | a chamada de criação |
| `WebhookController.php` | `app/Http/Controllers/` | a conferência precisa do `getContent()` |
| `config/services.php` | **acrescente** ao seu | não substitua o arquivo: adicione o bloco |
| `routes/web.php` | **acrescente** ao seu | o `withoutMiddleware` é o detalhe que importa |
| `database/migrations/…` | `database/migrations/` | sem o índice único, a dedup não segura concorrência |

## Envs

```bash
LEGITIMUZ_API_KEY=<SUA_CHAVE>
LEGITIMUZ_WEBHOOK_SECRET=<SEGREDO_DO_ENDPOINT>
LEGITIMUZ_FLOW_ID=<FLOW_PUBLIC_ID>
```

## Pontos de atenção

- **Esquecer o `withoutMiddleware` é o erro mais comum aqui.** O webhook responde `419` e o
  dashboard mostra a entrega falhando sem explicação óbvia no seu log.
- **`getContent()`, não `$request->all()`.** O segundo já fez o parse, e a assinatura falha.
- **`firstOrCreate` com índice único, não `SELECT` seguido de `INSERT`.** Duas entregas simultâneas
  passariam pela checagem em separado.
- **`hash_equals`**, não `===`: comparação em tempo constante.

## Limitações

`ProcessarDesfecho` é um job vazio. Sem tratamento de `429` — veja
[limites](https://documentacao.legitimuz.com/api/errors#limites-de-uso). O `VerificacaoController`
assume que `$request->user()->cadastro` existe no seu modelo.

## Referência

[Emitir a credencial](https://documentacao.legitimuz.com/guides/credential) ·
[Criar verificação](https://documentacao.legitimuz.com/api/create-verification) ·
[Segurança do webhook](https://documentacao.legitimuz.com/webhooks/security)
