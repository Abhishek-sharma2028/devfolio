import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PortfolioView } from "@/components/PortfolioView";
import { SiteBar } from "@/components/SiteBar";
import { Button } from "@/components/ui/button";
import { exampleImageSources, getExamplePortfolio } from "@/lib/example-portfolios";

export const Route = createFileRoute("/examples/$slug")({
  loader: ({ params }) => {
    const portfolio = getExamplePortfolio(params.slug);
    if (!portfolio) throw notFound();
    return portfolio;
  },
  head: ({ loaderData }) => {
    const title = `${loaderData?.name ?? "Example"} — Fictional portfolio | Devfolio`;
    const description = loaderData ? `Explore ${loaderData.name}'s fictional ${loaderData.role.toLowerCase()} portfolio, with detailed project case studies.` : "Explore a fictional Devfolio example portfolio.";
    return { meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] };
  },
  notFoundComponent: () => <main className="p-10"><h1 className="text-3xl">Example not found</h1><Link to="/" className="underline">Back to Devfolio</Link></main>,
  component: ExamplePortfolio,
});

function ExamplePortfolio() {
  const portfolio = Route.useLoaderData();
  return <>
    <SiteBar><Button asChild variant="outline" size="sm"><Link to="/">Back to Devfolio</Link></Button></SiteBar>
    <div className="border-b border-border bg-secondary px-6 py-3 text-center text-sm text-secondary-foreground">Fictional example · People, organisations, projects and outcomes are illustrative. Contact email is a placeholder.</div>
    <PortfolioView portfolio={portfolio} imageSources={exampleImageSources} />
  </>;
}