# Android

![Android](https://img.shields.io/badge/Android-3DDC84?logo=android&logoColor=white&style=flat-square)
![minSdk 24](https://img.shields.io/badge/minSdk_24-lightgrey?style=flat-square)
![Java 11](https://img.shields.io/badge/Java_11-007396?logo=openjdk&logoColor=white&style=flat-square)

> Referência de implementação, não projeto executável. **O artefato é privado**: o exemplo não
> compila sem o acesso ao Maven da Legitimuz.

[**Guia completo na doc →**](https://documentacao.legitimuz.com/sdks/android)

A SDK renderiza o fluxo dentro do seu app a partir do **embed URL** que o seu backend recebe em
`entry.url`. Ela não cria sessões.

## Arquivos

```
settings.gradle                                        # o repositório Maven privado
app/build.gradle                                       # a dependência, minSdk e Java 11
app/src/main/AndroidManifest.xml                       # configChanges e screenOrientation
app/src/main/java/com/exemplo/verificacao/VerificationActivity.java
```

## Onde cada arquivo entra

| Arquivo | Destino | Por quê |
| --- | --- | --- |
| `settings.gradle` | **acrescente** ao seu | só o bloco `maven`, não o arquivo inteiro |
| `app/build.gradle` | **acrescente** ao seu | a dependência e as opções de compilação |
| `AndroidManifest.xml` | **acrescente** ao seu | só os atributos da Activity hospedeira |
| `VerificationActivity.java` | junto das suas Activities | o ciclo completo: parse, sessão, view, destroy |

## Acesso ao artefato

O pacote `com.legitimuz:sdk` é privado. Peça ao [suporte](https://painel.legitimuz.com/support) a
URL do repositório Maven e as credenciais de leitura, ou o `.aar` da versão que você vai usar.
Guarde as credenciais em `~/.gradle/gradle.properties` ou numa variável de ambiente do CI, nunca no
repositório.

## Pontos de atenção

- **A Activity hospedeira tem que ser uma `ComponentActivity`.** Uma `AppCompatActivity` já é. A
  SDK pede as permissões pelo `ActivityResultRegistry` dela; sem isso os diálogos do sistema não
  abrem e a câmera nunca liga.
- **Sem `configChanges`, a rotação derruba a verificação.** A SDK é uma `View` e não trava a
  orientação do host por conta própria.
- **As permissões vêm do manifest da SDK por merge.** Não as repita no seu.
- **No modo `.aar`, as três transitivas são obrigatórias.** Sem elas o app compila e quebra em
  runtime com `NoClassDefFoundError`.
- **`COMPLETED` com `isSuccessfulSubmission()` é envio, não aprovação.** A decisão chega ao seu
  backend por webhook.
- **`LOAD_FAILED` normalmente não se trata:** a própria view mostra a tela de tentar de novo, e
  `onOutcome` pode disparar mais de uma vez por causa disso.

## Limitações

Não cria a verificação — veja [`pocs/express-backend`](../../pocs/express-backend) ou qualquer
outro backend. Não traz `build.gradle` de projeto, `gradle-wrapper` nem recursos de layout.

## Referência

[Android](https://documentacao.legitimuz.com/sdks/android) ·
[Criar verificação](https://documentacao.legitimuz.com/api/create-verification) ·
[Webhooks](https://documentacao.legitimuz.com/webhooks/introduction)
