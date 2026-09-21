import type { PageServerLoad } from "./$types";

// A credencial vem do servidor, então nunca fica no bundle.
export const load: PageServerLoad = async ({ fetch }) => {
  const response = await fetch("/api/verifications", { method: "POST" });
  const { entry } = await response.json();
  return { sdkUrl: entry.url };
};
