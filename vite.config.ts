// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// Never set ssr.external or resolve.external: the Worker has no runtime module resolution, so
// the build fails. Never add compression (compressPublicAssets, vite-plugin-compression):
// hosting already compresses at the edge.
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv, type Plugin } from "vite";

function localLovableOAuthBroker(): Plugin {
  let projectId = "";
  let projectEnv = "";

  return {
    name: "local-lovable-oauth-broker",
    apply: "serve",
    configResolved(config) {
      const env = loadEnv(config.mode, config.envDir, "");
      projectId = env.LOVABLE_PROJECT_ID ?? "";
      projectEnv = env.LOVABLE_PROJECT_ENV ?? "";

      // Lovable Cloud exposes these without the VITE_ prefix to server functions.
      // Mirror the public local-development values so SSR/server functions behave
      // the same way without requiring duplicate entries in .env.local.
      process.env.SUPABASE_URL ??= env.VITE_SUPABASE_URL;
      process.env.SUPABASE_PUBLISHABLE_KEY ??= env.VITE_SUPABASE_PUBLISHABLE_KEY;
    },
    configureServer(server) {
      server.middlewares.use("/~oauth/initiate", (request, response, next) => {
        if (!projectId) {
          next();
          return;
        }

        const params = new URL(request.url ?? "", "http://127.0.0.1").searchParams;
        params.set("project_id", projectId);
        if (projectEnv) params.set("project_env", projectEnv);

        const redirectUri = params.get("redirect_uri");
        if (redirectUri) {
          const redirect = new URL(redirectUri);
          if (redirect.hostname === "localhost") redirect.hostname = "127.0.0.1";
          params.set("redirect_uri", redirect.toString());
        }

        response.statusCode = 302;
        response.setHeader("Location", `https://oauth.lovable.app/initiate?${params.toString()}`);
        response.end();
      });
    },
  };
}

export default defineConfig({
  plugins: [localLovableOAuthBroker()],
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
