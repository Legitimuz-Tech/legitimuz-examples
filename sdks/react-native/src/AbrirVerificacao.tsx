import { Button, Linking } from "react-native";

/**
 * O caminho que funciona hoje sem biblioteca nenhuma: abrir o embed URL no navegador do
 * sistema. O titular volta ao app pelo deep link que o seu fluxo definir.
 *
 * `embedUrl` vem do SEU backend, em entry.url. A chave de API nunca vai para o app.
 */
export function AbrirVerificacao({ embedUrl }: { embedUrl: string }) {
  return (
    <Button
      title="Verificar identidade"
      onPress={async () => {
        // O desfecho NÃO volta por aqui: ele chega ao seu backend por webhook.
        await Linking.openURL(embedUrl);
      }}
    />
  );
}
