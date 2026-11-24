<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

- The Devfolio site is ported verbatim: markup in src/devfolio-body.html, styles and interaction script in public/devfolio/; edit those rather than rewriting into React, to keep parity with the original.
- Accounts and portfolios live in Lovable Cloud (`portfolios` table, owner RLS, public read when is_public); signed-in pages sit under src/routes/_authenticated/, shared pages at /p/$slug load through a publishable-key server function.
- The landing page's original "Log in"/"Create portfolio" buttons are intercepted in src/routes/index.tsx and routed to /auth or /dashboard; the vanilla script's localStorage demo login is no longer reachable.
- AI description writing runs only in a requireSupabaseAuth server function (src/lib/ai-writer.*) via the AI Gateway Responses API; keep prompts and keys server-side.
- Rich portfolio profile fields and project case studies use backward-compatible JSON parsers; themes are stored separately and resolved to a fixed allowlist so old portfolios continue working.
- PortfolioView is shared by the editor preview and public portfolio page, with scoped CSS theme tokens, so both show identical designs and project details.
- Portfolio media accepts HTTP(S) image URLs and allowlisted video embeds; do not inject arbitrary embed HTML, which would expose viewers to untrusted markup.
- Portfolio matching uses an authenticated server function, owner-filtered paginated reads, sequential complete candidate batches, and allowlisted result IDs; this prevents public or invented portfolios from entering personal search results.
- AI search uses request-local Responses/run-ID helpers and durable owner-scoped access-denial records; provider denials remain stopped across reloads until access is restored and the record is cleared.
- Fictional example portfolios are static data at /examples/$slug, separate from saved portfolios; trusted bundled image mappings let them use PortfolioView without weakening user-media URL validation or entering personal AI search results.
- Use the shared PortfolioShare control and URL helper for editor/dashboard showcase links; only saved public portfolios on a public HTTPS origin get copyable links, never protected preview or local URLs.
