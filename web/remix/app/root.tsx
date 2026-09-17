import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

export default function Root() {
  return (
    <html lang="pt-BR">
      <head>
        <Meta />
        <Links />
        {/* Antes dos scripts do app: registra window.Legitimuz. */}
        <script src="https://sdk.legitimuz.com/v1/websdk.js" />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
