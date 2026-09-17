package com.exemplo.verificacao;

import android.os.Bundle;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.legitimuz.Legitimuz;
import com.legitimuz.LegitimuzCallback;
import com.legitimuz.LegitimuzCompleteResult;
import com.legitimuz.LegitimuzEmbedUrlError;
import com.legitimuz.LegitimuzEvent;
import com.legitimuz.LegitimuzResult;
import com.legitimuz.LegitimuzSessionHandle;
import com.legitimuz.LegitimuzVerificationOutcome;
import com.legitimuz.LegitimuzVerificationView;

/**
 * A Activity hospedeira tem que ser uma ComponentActivity — AppCompatActivity já é.
 * A SDK pede as permissões pelo ActivityResultRegistry dela.
 */
public class VerificationActivity extends AppCompatActivity {

    private static final String TAG = "LegitimuzExemplo";

    private LegitimuzSessionHandle handle;

    /**
     * @param urlDoSeuBackend o embed URL, vindo de entry.url na sua API.
     *                        A SDK não cria sessões: ela renderiza uma que já existe.
     */
    private void iniciarVerificacao(String urlDoSeuBackend) {
        // Opcional: createSession valida de novo internamente. Isto só dá o retorno mais cedo.
        LegitimuzResult<String, LegitimuzEmbedUrlError> parsed =
                Legitimuz.parseEmbedUrl(urlDoSeuBackend);
        if (!parsed.isSuccess()) {
            // getMessage() já vem em pt-BR, pronto para exibir.
            mostrarErro(parsed.getError().getMessage());
            return;
        }

        // O terceiro parâmetro é requestsDeviceAccessAutomatically: com true, a SDK pede
        // câmera, microfone e localização antes de a página carregar.
        LegitimuzResult<LegitimuzSessionHandle, LegitimuzEmbedUrlError> resultado =
                Legitimuz.createSession(this, urlDoSeuBackend, true);
        if (!resultado.isSuccess()) {
            mostrarErro(resultado.getError().getMessage());
            return;
        }

        handle = resultado.getValue();
        handle.setCallback(new LegitimuzCallback() {
            @Override
            public void onEvent(@NonNull LegitimuzEvent event) {
                Log.d(TAG, "event=" + event.getType());
            }

            @Override
            public void onOutcome(@NonNull LegitimuzVerificationOutcome outcome) {
                switch (outcome.getKind()) {
                    case COMPLETED:
                        LegitimuzCompleteResult completo = outcome.getCompleteResult();
                        // isSuccessfulSubmission() é ENVIO, não aprovação. A decisão chega
                        // ao seu backend por webhook.
                        Log.i(TAG, "enviado=" + (completo != null && completo.isSuccessfulSubmission()));
                        break;
                    case CANCELLED:
                        Log.i(TAG, "cancelado pelo titular");
                        break;
                    case FAILED:
                        mostrarErro(outcome.getError().getDisplayMessage());
                        break;
                    case LOAD_FAILED:
                        // A própria view já mostra a tela de "Tentar novamente".
                        return;
                }
                encerrar();
            }
        });

        // LegitimuzVerificationView é uma FrameLayout comum, sem toolbar nem navegação própria.
        LegitimuzVerificationView verificationView = new LegitimuzVerificationView(this);
        setContentView(verificationView);
        handle.attach(verificationView);
    }

    private void encerrar() {
        if (handle != null) {
            // Encerra o fluxo, apaga os cookies e o storage da verificação e destrói a WebView.
            handle.destroy();
            handle = null;
        }
    }

    private void mostrarErro(String mensagem) {
        Log.e(TAG, mensagem);
        // Substitua pela sua UI de erro.
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Substitua pela sua chamada real ao backend.
        iniciarVerificacao(getIntent().getStringExtra("embedUrl"));
    }

    @Override
    protected void onDestroy() {
        encerrar();
        super.onDestroy();
    }
}
