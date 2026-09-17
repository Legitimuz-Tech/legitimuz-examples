import type { PageServerLoad } from "./$types";

// A credencial vem do servidor, então nunca fica no bundle.
export const load: PageServerLoad = async ({ fetch }) => {
  const resposta = await fetch("/api/verificacoes", { method: "POST" });
  const { entry } = await resposta.json();
  return { sdkUrl: entry.url };
};
