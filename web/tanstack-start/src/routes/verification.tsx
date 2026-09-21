import { createFileRoute } from "@tanstack/react-router";
import { useLegitimuz } from "../hooks/useLegitimuz";
import { createVerification } from "../server/create-verification";

export const Route = createFileRoute("/verification")({
  loader: () => createVerification(),
  component: Verification,
});

function Verification() {
  const { sdkUrl } = Route.useLoaderData();
  const { containerRef, status } = useLegitimuz({ sdkUrl });

  return (
    <>
      <div ref={containerRef} style={{ height: 640 }} />
      <p>{status}</p>
    </>
  );
}
