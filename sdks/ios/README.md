# iOS

![iOS 17+](https://img.shields.io/badge/iOS_17+-000000?logo=apple&logoColor=white&style=flat-square)
![Swift](https://img.shields.io/badge/Swift-F05138?logo=swift&logoColor=white&style=flat-square)
![SwiftUI](https://img.shields.io/badge/SwiftUI-0071E3?logo=swift&logoColor=white&style=flat-square)

> Referência de implementação, não projeto executável. **O artefato é privado**: o exemplo não
> compila sem o `.xcframework` da Legitimuz.

[**Guia completo na doc →**](https://documentacao.legitimuz.com/sdks/ios)

A SDK renderiza o fluxo dentro do seu app a partir do **embed URL** que o seu backend recebe em
`entry.url`. Ela não cria sessões.

## Arquivos

```
Verificacao/VerificationFlow.swift   # parse, sessão, apresentação e outcome
Verificacao/Info.plist               # as três chaves de permissão
conferir-xcframework.sh              # baixa e confere o SHA-256 antes de embutir
```

## Onde cada arquivo entra

| Arquivo | Destino | Por quê |
| --- | --- | --- |
| `VerificationFlow.swift` | junto das suas telas | o ciclo completo num arquivo |
| `Info.plist` | **acrescente** ao seu | só as três chaves, não o arquivo inteiro |
| `conferir-xcframework.sh` | o seu script de setup | integridade antes de embutir |

## Instalação

**Não há SPM e não há CocoaPods.** A SDK é um `.xcframework` fechado:

```bash
./conferir-xcframework.sh <VERSAO>
```

No Xcode, vá ao target em **General → Frameworks, Libraries, and Embedded Content**, clique em
**+**, escolha **Add Other → Add Files...** e selecione o `.xcframework`. Confirme que o **Embed**
está como **Embed & Sign**.

Peça ao [suporte](https://painel.legitimuz.com/support) qual versão usar.

## Pontos de atenção

- **`@unknown default` não é opcional.** A SDK é compilada com library evolution, então os enums
  públicos são resilientes e o `switch` não compila sem ele. Vale para
  `LegitimuzVerificationOutcome`, `LegitimuzEventType`, `LegitimuzURLOpenReason`,
  `LegitimuzCompleteResult.Status` e `LegitimuzEmbedURL.ValidationError`. A exceção é `JSONValue`,
  que é `@frozen`.
- **Xcode 26 ou mais novo.** A interface de módulo Swift é compatível só para frente: o piso é a
  versão que compilou o release.
- **As três chaves de `Info.plist` são do seu app, não da SDK.** Sem elas o processo é encerrado
  quando o widget tenta o hardware.
- **`.completed` é envio, não aprovação.** A decisão chega ao seu backend por webhook.
- **`.loadFailed` normalmente não se trata:** a própria view mostra a tela de tentar de novo.
- **`LegitimuzEmbedURL.parse` aceita `https://` ou `http://localhost`** — é o que o WebKit exige
  para liberar câmera e microfone.

## Limitações

Não cria a verificação — veja [`pocs/express-backend`](../../pocs/express-backend) ou qualquer
outro backend. Não traz `.xcodeproj`, `project.yml` nem observação de `session.events`; o catálogo
de eventos está na doc.

## Referência

[iOS](https://documentacao.legitimuz.com/sdks/ios) ·
[Criar verificação](https://documentacao.legitimuz.com/api/create-verification) ·
[Webhooks](https://documentacao.legitimuz.com/webhooks/introduction)
