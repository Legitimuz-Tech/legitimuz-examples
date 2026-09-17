import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";

export const Route = createRootRoute({
  head: () => ({
    // Registra window.Legitimuz antes do bundle.
    scripts: [{ src: "https://sdk.legitimuz.com/v1/websdk.js" }],
  }),
  component: () => (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  ),
});
