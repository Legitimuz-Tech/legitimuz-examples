import { VerificationWidget } from "@/components/VerificationWidget";

// Sem "use client" aqui: a página continua Server Component e passa a sdkUrl como prop.
export default function Page() {
  return (
    <main>
      <VerificationWidget sdkUrl={process.env.NEXT_PUBLIC_LEGITIMUZ_SDK_URL!} />
    </main>
  );
}
