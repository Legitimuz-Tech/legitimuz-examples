# Mobile SDKs

As SDKs de Android e iOS renderizam o fluxo de verificação dentro do seu app. Por baixo elas
carregam o mesmo widget da web numa WebView, com uma ponte nativa — mas a superfície que você
programa é a da SDK, não a de uma WebView.

## O artefato é liberado sob solicitação

| Plataforma | Distribuição |
| --- | --- |
| Android | Maven privado (`com.legitimuz:sdk`) ou `.aar` fechado |
| iOS | `.xcframework` fechado, sem SPM e sem CocoaPods |
| React Native | não há SDK publicada |

Peça o acesso ao [suporte](https://painel.legitimuz.com/support). Os exemplos aqui são referência
de leitura: eles mostram os arquivos e as chamadas, e não compilam sem o artefato.

## A entrada é o embed URL

As duas SDKs recebem o **embed URL** que o seu backend obtém em `entry.url` ao chamar
[criar verificação](https://documentacao.legitimuz.com/api/create-verification). Elas não criam
sessão: renderizam uma que já existe.

A chave de API nunca vai para o app.

## O desfecho não chega aqui

`COMPLETED` / `.completed` confirma que o titular **enviou** os dados, não que a verificação foi
aprovada. A decisão chega ao seu backend por webhook.

Guias completos em [Android](https://documentacao.legitimuz.com/sdks/android) e
[iOS](https://documentacao.legitimuz.com/sdks/ios).
