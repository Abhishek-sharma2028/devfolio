import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Search, LoaderCircle, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { findSavedPortfolios } from "@/lib/portfolio-search.functions";
import type { Match } from "@/lib/portfolio-search";

type Portfolio = { id: string; name: string; role: string; is_public: boolean };
export function PortfolioFinder({ portfolios }: { portfolios: Portfolio[] }) {
  const find = useServerFn(findSavedPortfolios);
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [matches, setMatches] = useState<Match[] | null>(null);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy || description.trim().length < 3) return;
    setBusy(true); setError(""); setMatches(null);
    try {
      const result = await find({ data: { description: description.trim() } });
      if (result.ok) setMatches(result.matches); else setError(result.error);
    } catch { setError("AI search could not complete. Please try again later."); }
    finally { setBusy(false); }
  }
  return <section className="border-b border-border py-8" aria-labelledby="finder-heading">
    <div className="mb-4 flex items-center gap-2"><Search className="size-5 text-primary" /><h2 id="finder-heading" className="text-xl font-semibold">Find a portfolio</h2><span className="font-mono text-xs text-muted-foreground">AI MATCH</span></div>
    <form onSubmit={submit} className="grid gap-3">
      <Label htmlFor="portfolio-description">What are you looking for?</Label>
      <Textarea id="portfolio-description" placeholder="My dark-themed portfolio with React projects and a video case study…" value={description} maxLength={2000} disabled={busy} onChange={event => { setDescription(event.target.value); setMatches(null); setError(""); }} className="min-h-24 bg-card" />
      <div className="flex flex-wrap items-center justify-between gap-3"><span className="text-sm text-muted-foreground">{portfolios.length} saved {portfolios.length === 1 ? "portfolio" : "portfolios"}</span><Button type="submit" disabled={busy || description.trim().length < 3 || !portfolios.length}>{busy ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" /> : <Search className="size-4" />}{busy ? "Finding matches…" : "Find matches"}</Button></div>
    </form>
    {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
    <div aria-live="polite" aria-busy={busy}>
      {matches && <div className="mt-6"><h3 className="text-sm font-semibold">{matches.length ? "Best matches" : "No matching portfolios found."}</h3><ul className="divide-y divide-border">{matches.map(match => {
        const portfolio = portfolios.find(item => item.id === match.id);
        if (!portfolio) return null;
        return <li key={match.id} className="flex flex-wrap items-center justify-between gap-3 py-4"><div className="min-w-0 flex-1 basis-64"><p className="break-words font-semibold">{portfolio.name || "Untitled portfolio"}</p><p className="mt-1 break-words text-sm text-muted-foreground">{match.reason}</p><p className="mt-1 font-mono text-xs text-muted-foreground">{portfolio.is_public ? "Public" : "Private"}</p></div><Button asChild variant="outline" size="sm"><Link to="/portfolio/$id" params={{ id: match.id }}>Open<ArrowUpRight className="size-4" /></Link></Button></li>;
      })}</ul></div>}
    </div>
  </section>;
}