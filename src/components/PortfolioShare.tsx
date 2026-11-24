import { useEffect, useState } from "react";
import { Copy, ExternalLink, Linkedin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { portfolioShareUrl } from "@/lib/portfolio";

export function PortfolioShare({ slug, isPublic, compact = false }: { slug: string; isPublic: boolean; compact?: boolean }) {
  const [origin, setOrigin] = useState("");
  useEffect(() => { setOrigin(window.location.origin); }, []);
  const url = portfolioShareUrl(origin, slug, isPublic);
  async function copy() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Portfolio link copied — ready for LinkedIn");
    } catch { toast.error("Couldn't copy the link. Select and copy it below."); }
  }
  if (!isPublic) return null;
  if (compact) return <Button variant="outline" size="sm" onClick={copy} disabled={!url} title={url ? "Copy portfolio link for LinkedIn" : "Publish Devfolio to enable public links"}><Copy className="size-4" />Copy link</Button>;
  return <div className="grid min-w-0 gap-3 border-t border-border pt-4">
    <h3 className="flex items-center gap-2 font-semibold"><Linkedin className="size-4" />Your portfolio link</h3>
    {url ? <>
      <Input aria-label="Public portfolio link" readOnly value={url} onFocus={(event) => event.target.select()} className="bg-card font-mono text-xs" />
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={copy}><Copy className="size-4" />Copy link for LinkedIn</Button>
        <Button asChild size="sm" variant="ghost"><a href={url} target="_blank" rel="noopener noreferrer"><ExternalLink className="size-4" />Open portfolio</a></Button>
      </div>
      <p className="text-sm text-muted-foreground">Add this link to your LinkedIn Featured section or profile website.</p>
    </> : <p className="text-sm text-muted-foreground">Your public portfolio is saved. Devfolio must be published before a link can be shared on LinkedIn.</p>}
  </div>;
}