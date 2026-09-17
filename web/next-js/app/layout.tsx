import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        {/* beforeInteractive só é aceito em app/layout.tsx. É o que garante que
            window.Legitimuz existe antes de qualquer efeito de componente cliente rodar. */}
        <Script src="https://sdk.legitimuz.com/v1/websdk.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
