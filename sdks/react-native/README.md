# React Native

![React Native](https://img.shields.io/badge/React_Native-20232A?logo=react&logoColor=61DAFB&style=flat-square)
![sem SDK publicada](https://img.shields.io/badge/sem_SDK_publicada-lightgrey?style=flat-square)

> Referência de implementação, não projeto executável.

[**Guia completo na doc →**](https://documentacao.legitimuz.com/sdks/react-native)

**Não existe SDK React Native publicada.** Este diretório reúne o que funciona hoje: as permissões
nos dois projetos nativos, e a entrega por link, que não exige biblioteca.

Se você precisa do fluxo **dentro** do app, escreva uma ponte fina para as SDKs de
[Android](../android) e [iOS](../ios).

## Arquivos

```
android/app/src/main/AndroidManifest.xml  # as cinco permissões
ios/SeuApp/Info.plist                     # as três chaves
app.json                                  # as mesmas, no formato Expo
src/AbrirVerificacao.tsx                  # entrega por link, sem biblioteca
```

## Onde cada arquivo entra

| Arquivo | Destino | Por quê |
| --- | --- | --- |
| `android/app/src/main/AndroidManifest.xml` | **acrescente** ao seu | só as permissões |
| `ios/SeuApp/Info.plist` | **acrescente** ao seu | só as três chaves |
| `app.json` | o seu `app.json` | no Expo, não edite os projetos nativos |
| `src/AbrirVerificacao.tsx` | junto dos seus componentes | o caminho sem biblioteca |

## Envs

Nenhuma no app. O `embedUrl` vem do seu backend em tempo de execução.

A chave de API **não** vai para o `.env` do React Native: tudo que está lá acaba no bundle, e o
bundle é legível.

## Pontos de atenção

- **`@legitimuz/react-native-sdk` nunca foi publicado.** Se você encontrou esse import numa
  documentação antiga, ele não existe.
- **O desfecho não volta pelo link.** A decisão chega ao seu backend por webhook.
- **As permissões são necessárias em qualquer caminho que abra o fluxo dentro do app.** Pela
  entrega por link, quem pede é o navegador.

## Limitações

Não traz uma ponte nativa pronta. Não usa `react-native-webview`: as SDKs nativas existem
justamente porque uma WebView crua precisa de configuração específica para liberar câmera e
microfone, e esse caminho não foi verificado aqui.

## Referência

[React Native](https://documentacao.legitimuz.com/sdks/react-native) ·
[Android](https://documentacao.legitimuz.com/sdks/android) ·
[iOS](https://documentacao.legitimuz.com/sdks/ios)
