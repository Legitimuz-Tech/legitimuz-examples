import { useLoaderData } from "react-router";
import { useLegitimuz } from "~/hooks/useLegitimuz";
import { authenticate, db } from "~/lib/stubs";

// O loader roda só no servidor. A chave nunca chega ao bundle do cliente.
export async function loader({ request }: { request: Request }) {
  const user = await authenticate(request);
  const registration = await db.registration.byUser(user.id);

  const response = await fetch("https://api.legitimuz.com/public/verifications", {
    method: "POST",
    headers: {
      "X-API-Key": process.env.LEGITIMUZ_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      schema_version: "1.0",
      ref_id: registration.id,
      document: { type: "cpf", number: registration.cpf },
      flow_public_id: process.env.LEGITIMUZ_FLOW_ID!,
    }),
  });

  const { verification, entry } = await response.json();
  await db.registration.link(registration.id, verification.public_id);

  // Só a sdkUrl vai para o componente.
  return { sdkUrl: entry.url as string };
}

export default function Verification() {
  const { sdkUrl } = useLoaderData<typeof loader>();
  const { containerRef, status } = useLegitimuz({ sdkUrl });

  return (
    <>
      <div ref={containerRef} style={{ height: 640 }} />
      <p>{status}</p>
    </>
  );
}
