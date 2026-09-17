import SwiftUI
import LegitimuzWebViewSDK

struct VerificationFlow: View {
    /// Vem do seu backend, em entry.url. A SDK não cria sessões.
    let urlDoSeuBackend: String

    @State private var session: LegitimuzVerificationSession?
    @State private var errorMessage: String?

    var body: some View {
        VStack {
            Button("Iniciar verificação") { startVerification() }
        }
        .fullScreenCover(item: $session) { session in
            LegitimuzVerificationView(session: session)
                .ignoresSafeArea()
                .task {
                    switch await session.outcome() {
                    case .completed(let result):
                        // isSuccessfulSubmission é ENVIO, não aprovação. A decisão chega
                        // ao seu backend por webhook.
                        errorMessage = nil
                        print("enviado: \(result.isSuccessfulSubmission)")
                    case .cancelled:
                        break
                    case .failed(let error):
                        errorMessage = error.displayMessage
                    case .loadFailed(let message):
                        errorMessage = message
                    @unknown default:
                        // Obrigatório: a SDK é distribuída com library evolution, então os
                        // enums públicos são resilientes e o switch não compila sem isto.
                        break
                    }
                    self.session = nil
                }
        }
        .alert("Erro", isPresented: .constant(errorMessage != nil)) {
            Button("OK") { errorMessage = nil }
        } message: {
            Text(errorMessage ?? "")
        }
    }

    private func startVerification() {
        // Opcional: o init da sessão valida de novo. Isto só dá o retorno mais cedo.
        switch LegitimuzEmbedURL.parse(urlDoSeuBackend) {
        case .success(let embedURL):
            session = try? LegitimuzVerificationSession(embedURL: embedURL)
        case .failure(let error):
            // errorDescription já vem em pt-BR, pronto para exibir.
            errorMessage = error.errorDescription
        @unknown default:
            break
        }
    }
}

extension LegitimuzVerificationSession: Identifiable {
    public var id: ObjectIdentifier { ObjectIdentifier(self) }
}
