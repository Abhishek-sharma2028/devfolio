import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getPublicPortfolio } from "@/lib/public-portfolio.functions";
import { PortfolioView } from "@/components/PortfolioView";
import { SiteBar } from "@/components/SiteBar";

export const Route = createFileRoute("/p/$slug")({
  loader: async ({ params }) => {
    const row = await getPublicPortfolio({ data: { slug: params.slug } });
    if (!row) throw notFound();
    return row;
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.name || "Portfolio"} — Devfolio` : "Portfolio — Devfolio";
    const desc = loaderData?.bio?.slice(0, 155) || `${loaderData?.role ?? "Student developer"} portfolio on Devfolio.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center bg-background p-6 text-center">
      <div>
        <p className="font-serif text-4xl italic">Portfolio not found.</p>
        <p className="mt-2 text-muted-foreground">It may be private or no longer exist.</p>
        <Link to="/" className="mt-6 inline-block underline">Back to Devfolio</Link>
      </div>
    </div>
  ),
  component: PublicPortfolio,
});

function PublicPortfolio() {
  const p = Route.useLoaderData();
  return <div className="min-h-screen"><SiteBar /><PortfolioView portfolio={p} /></div>;
}
