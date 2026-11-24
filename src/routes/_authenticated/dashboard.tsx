import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SiteBar } from "@/components/SiteBar";
import { slugify } from "@/lib/portfolio";
import { PortfolioFinder } from "@/components/PortfolioFinder";
import { PortfolioShare } from "@/components/PortfolioShare";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Your portfolios — Devfolio" },
      { name: "description", content: "Create, edit and share your Devfolio portfolios." },
      { property: "og:title", content: "Your portfolios — Devfolio" },
      { property: "og:description", content: "Create, edit and share your Devfolio portfolios." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

export function SignOutButton() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={async () => {
        await qc.cancelQueries();
        qc.clear();
        await supabase.auth.signOut();
        navigate({ to: "/auth", search: { redirect: undefined }, replace: true });
      }}
    >
      Sign out
    </Button>
  );
}

function Dashboard() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["my-portfolios", user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolios")
        .select("id, slug, name, role, is_public, updated_at")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const create = useMutation({
    mutationFn: async () => {
      const name = user.email?.split("@")[0] ?? "me";
      const { data, error } = await supabase
        .from("portfolios")
        .insert({ user_id: user.id, slug: slugify(name), name: "", is_public: false })
        .select("id")
        .single();
      if (error) throw error;
      return data.id;
    },
    onSuccess: (id) => navigate({ to: "/portfolio/$id", params: { id } }),
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="min-h-screen bg-background">
      <SiteBar>
        <span className="hidden text-sm text-muted-foreground sm:inline">{user.email}</span>
        <SignOutButton />
      </SiteBar>
      <main className="mx-auto max-w-5xl px-6 py-14">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-8">
          <div>
            <p className="eyebrow-label">Dashboard</p>
            <h1 className="mt-3 text-5xl font-semibold tracking-tighter">
              Your <em className="display-em">portfolios.</em>
            </h1>
          </div>
          <Button className="h-11" onClick={() => create.mutate()} disabled={create.isPending}>
            New portfolio ↗
          </Button>
        </div>
        {!isLoading && data && <PortfolioFinder key={user.id} portfolios={data} />}
        {isLoading ? (
          <p className="py-10 text-muted-foreground">Loading…</p>
        ) : !data?.length ? (
          <div className="py-16 text-center">
            <p className="font-serif text-3xl italic">Nothing here yet.</p>
            <p className="mt-2 text-muted-foreground">Start your first portfolio. The AI writer can polish your project descriptions.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {data.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-4 py-5">
                <div>
                  <p className="text-lg font-semibold">{p.name || "Untitled portfolio"}</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {p.role || "No role yet"} · {p.is_public ? "Public" : "Private"} · updated {new Date(p.updated_at).toLocaleDateString()}
                  </p>
                </div>
                 <div className="flex flex-wrap gap-2">
                   <PortfolioShare slug={p.slug} isPublic={p.is_public} compact />
                  {p.is_public && (
                    <Button asChild variant="outline" size="sm">
                      <Link to="/p/$slug" params={{ slug: p.slug }}>View</Link>
                    </Button>
                  )}
                  <Button asChild size="sm">
                    <Link to="/portfolio/$id" params={{ id: p.id }}>Edit</Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
