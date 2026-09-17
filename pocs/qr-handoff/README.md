# Passar do desktop para o celular

![Next.js 15](https://img.shields.io/badge/Next.js_15-000000?logo=nextdotjs&logoColor=white&style=flat-square)
![qrcode](https://img.shields.io/badge/qrcode-lightgrey?style=flat-square)

> Referência de implementação, não projeto executável.

[**Guia completo na doc →**](https://documentacao.legitimuz.com/guides/pocs/qr-handoff)

Webcam de notebook rende captura pior que a câmera traseira de um celular. A `entry.url` resolve
isso sem chamada nova: é a mesma jornada, aberta em outro aparelho.

## Arquivos

```
app/api/verificacoes/route.ts         # gera o QR a partir da entry.url, no servidor
app/api/verificacoes/estado/route.ts  # o desktop pergunta ao SEU banco
app/cadastro/qr.tsx                   # mostra o QR e espera
lib/stubs.ts                          # autenticar(), db e a criação — substitua
package.json                          # referência de dependência, sem lockfile
.env.example                          # as três variáveis
```

## Onde cada um entra

| Arquivo | Destino | Por quê |
| --- | --- | --- |
| `app/api/verificacoes/route.ts` | a sua rota de criação | o QR nasce no servidor |
| `app/api/verificacoes/estado/route.ts` | uma rota de leitura | lê o que o seu webhook gravou |
| `app/cadastro/qr.tsx` | a tela de desktop | o polling e os três estados |

## Envs

```bash
LEGITIMUZ_API_KEY=<SUA_CHAVE>
LEGITIMUZ_WEBHOOK_SECRET=<SEGREDO_DO_ENDPOINT>
LEGITIMUZ_FLOW_ID=<FLOW_PUBLIC_ID>
```

## O que morde

- **A `entry.url` carrega a credencial da jornada.** Não a coloque em `<a href>`, em parâmetro de
  query, em log ou em analytics. O QR é a única superfície onde ela deve aparecer, e só para o
  titular daquela verificação.
- **Gere o QR no servidor.** Mandar a URL para o cliente montar o QR a expõe no estado da página.
- **O estado vem do seu banco, não da Legitimuz.** Consultar a API num intervalo gasta o teto da
  chave e não traz nada que o webhook não traga.
- **Confira `entry.kind`.** Só `"web"` tem `url` para virar QR.
- **A imagem tem `alt`.** É a única pista para quem usa leitor de tela.

## O que não faz

Polling simples de 3 segundos — em produção, SSE ou WebSocket poupa requisição. Sem botão de
reenviar por SMS. Sem tratamento de titular que abre o QR em dois aparelhos.

## Referência

[Criar verificação](https://documentacao.legitimuz.com/api/create-verification) ·
[Retomada e expiração](https://documentacao.legitimuz.com/guides/pocs/resume-expiry) ·
[WhatsApp](https://documentacao.legitimuz.com/guides/pocs/whatsapp-handoff)
