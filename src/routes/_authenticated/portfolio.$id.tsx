import type * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { SiteBar } from "@/components/SiteBar";
import { parseProjects, parseProfile, parseTheme, profileFields, themes, emptyProject, type PortfolioProject, type PortfolioProfile, type PortfolioTheme } from "@/lib/portfolio";
import { PortfolioView } from "@/components/PortfolioView";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Eye, Check, Image, Sparkles } from "lucide-react";
import { polishWithAi } from "@/lib/ai-writer.functions";
import { PortfolioShare } from "@/components/PortfolioShare";

export const Route = createFileRoute("/_authenticated/portfolio/$id")({
  head: () => ({
    meta: [
      { title: "Edit portfolio — Devfolio" },
      { name: "description", content: "Edit your portfolio and let AI polish your project descriptions." },
      { property: "og:title", content: "Edit portfolio — Devfolio" },
      { property: "og:description", content: "Edit your portfolio and let AI polish your project descriptions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Editor,
});

type Form = { name: string; role: string; location: string; bio: string; skills: string; is_public: boolean; slug: string; projects: PortfolioProject[]; theme: PortfolioTheme; profile: PortfolioProfile };


function Editor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const polish = useServerFn(polishWithAi);
  const [form, setForm] = useState<Form | null>(null);
  const [preview, setPreview] = useState(false);
  const [live, setLive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedPublic, setSavedPublic] = useState<boolean | null>(null);
  const [writing, setWriting] = useState<string | null>(null);

  const { data, error } = useQuery({
    queryKey: ["portfolio", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("portfolios").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
  });
  useEffect(() => {
    if (data && !form)
      setForm({
        name: data.name, role: data.role, location: data.location, bio: data.bio,
        skills: data.skills.join(", "), is_public: data.is_public, slug: data.slug,
        theme: parseTheme(data.theme), profile: parseProfile(data.profile),
        projects: parseProjects(data.projects).length ? parseProjects(data.projects) : [emptyProject()],
      });
  }, [data, form]);

  if (error) return <p className="p-10">This portfolio couldn't be found.</p>;
  if (!form) return <p className="p-10 text-muted-foreground">Loading…</p>;

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm({ ...form, [k]: v });
  const setProject = (i: number, patch: Partial<PortfolioProject>) =>
    set("projects", form.projects.map((p, j) => (j === i ? { ...p, ...patch } : p)));

  async function runAi(key: string, input: Parameters<typeof polish>[0]["data"], apply: (t: string) => void) {
    setWriting(key);
    try {
      const res = await polish({ data: input });
      if (res.ok) {
        apply(res.text);
        toast.success("Draft written. Edit it however you like.");
      } else toast.error(res.error);
    } catch {
      toast.error("The AI writer is unavailable right now.");
    } finally {
      setWriting(null);
    }
  }

  async function save() {
    if (!form) return;
    setSaving(true);
    const { error } = await supabase
      .from("portfolios")
      .update({
        name: form.name.trim(), role: form.role.trim(), location: form.location.trim(), bio: form.bio.trim(),
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 20),
        is_public: form.is_public, theme: form.theme, profile: form.profile,
        projects: form.projects.filter((p) => p.name.trim() || p.description.trim() || p.details.trim()),
      })
      .eq("id", id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    setSavedPublic(form.is_public);
    qc.invalidateQueries({ queryKey: ["my-portfolios"] });
    qc.invalidateQueries({ queryKey: ["portfolio", id] });
    toast.success(form.is_public ? "Public portfolio saved" : "Portfolio saved privately");
  }

  async function remove() {
    if (!window.confirm("Delete this portfolio? This can't be undone.")) return;
    const { error } = await supabase.from("portfolios").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["my-portfolios"] });
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteBar>
        <Button asChild variant="ghost" size="sm"><Link to="/dashboard">← Dashboard</Link></Button>
        <Button variant="outline" size="sm" onClick={() => setPreview(true)}><Eye className="size-4" />Preview</Button>
        <Button size="sm" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
      </SiteBar>
      <main className="mx-auto grid max-w-5xl gap-10 px-6 py-12">
        <div>
          <p className="eyebrow-label">Portfolio editor</p>
          <h1 className="mt-3 text-5xl font-semibold tracking-normal">Tell your <em className="display-em">story.</em></h1>
        </div>

        <section className="grid gap-3">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-2xl font-semibold tracking-normal">Live preview</h2>
            <Button variant="outline" size="sm" onClick={() => setLive((v) => !v)}>
              <Eye className="size-4" />{live ? "Hide preview" : "Show preview"}
            </Button>
          </div>
          {live && (
            <div className="max-h-[75vh] overflow-y-auto rounded-sm border border-border">
              <PortfolioView portfolio={{ ...form, skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean) }} />
            </div>
          )}
        </section>

        <section className="grid gap-4">
          <div className="flex items-baseline justify-between"><h2 className="text-2xl font-semibold">Make it yours</h2><span className="font-mono text-xs text-muted-foreground">{String(themes.length).padStart(2, "0")} themes</span></div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" role="group" aria-label="Portfolio theme">
            {themes.map((theme) => <Button key={theme.id} variant="outline" aria-pressed={form.theme === theme.id} onClick={() => set("theme", theme.id)} className={`theme-option h-auto flex-col items-stretch gap-0 overflow-hidden p-0 text-left ${form.theme === theme.id ? "ring-2 ring-ring" : ""}`}>
              <span data-portfolio-theme={theme.id} className="theme-swatch relative flex aspect-[4/3] flex-col justify-center gap-2 bg-background p-4 text-foreground"><span className="portfolio-name text-2xl">Aa<span className="text-highlight">.</span></span><span className="h-1 w-3/4 bg-foreground"/><span className="h-1 w-1/2 bg-highlight"/>{form.theme === theme.id && <Check className="absolute right-2 top-2 size-4" />}</span>
              <span className="p-3"><span className="block text-sm font-semibold">{theme.name}</span><span className="block text-[10px] font-normal text-muted-foreground">{theme.caption}</span></span>
            </Button>)}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <Field label="Your name"><Input value={form.name} onChange={(e) => set("name", e.target.value)} className="bg-card" /></Field>
          <Field label="Role"><Input placeholder="Full-stack developer" value={form.role} onChange={(e) => set("role", e.target.value)} className="bg-card" /></Field>
          <Field label="Location"><Input value={form.location} onChange={(e) => set("location", e.target.value)} className="bg-card" /></Field>
          <Field label="Skills (comma separated)"><Input placeholder="React, Python, Figma" value={form.skills} onChange={(e) => set("skills", e.target.value)} className="bg-card" /></Field>
          <div className="sm:col-span-2">
            <Field label="About me">
              <Textarea rows={4} value={form.bio} onChange={(e) => set("bio", e.target.value)} className="bg-card" placeholder="A few notes about you; the AI can turn them into a polished bio." />
            </Field>
            <Button variant="outline" size="sm" className="mt-2" disabled={writing !== null}
              onClick={() => runAi("bio", { kind: "bio", name: form.name, role: form.role, title: "", details: form.bio, skills: form.skills }, (t) => set("bio", t))}>
              {writing === "bio" ? "Writing…" : "✦ Polish with AI"}
            </Button>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <h2 className="text-2xl font-semibold sm:col-span-2">Beyond the basics</h2>
          {profileFields.map(([key, label]) => <div key={key} className={["experience", "education", "achievements", "interests"].includes(key) ? "sm:col-span-2" : ""}><Field label={label}>
            {["experience", "education", "achievements", "interests"].includes(key) ? <Textarea rows={4} value={form.profile[key]} onChange={(e) => set("profile", { ...form.profile, [key]: e.target.value })} /> : <Input type={key === "email" ? "email" : ["website", "github", "linkedin", "resume", "portrait"].includes(key) ? "url" : "text"} value={form.profile[key]} onChange={(e) => set("profile", { ...form.profile, [key]: e.target.value })} />}
          </Field></div>)}
        </section>

        <section className="grid gap-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-2xl font-semibold tracking-normal">Projects</h2>
            <Button variant="outline" size="sm" onClick={() => set("projects", [...form.projects, emptyProject()])}>+ Add project</Button>
          </div>
          {form.projects.map((p, i) => (
            <article key={i} className="editor-project grid gap-4 rounded-sm border border-border bg-card p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Project name"><Input value={p.name} onChange={(e) => setProject(i, { name: e.target.value })} /></Field>
                <Field label="Link"><Input placeholder="https://github.com/…" value={p.link} onChange={(e) => setProject(i, { link: e.target.value })} /></Field>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {([["category", "Category"], ["year", "Year / timeline"], ["contribution", "Your role / contribution"], ["technologies", "Technologies used"], ["repository", "Source code link"], ["video", "Video link (YouTube, Vimeo or MP4)"]] as const).map(([key, label]) => <Field key={key} label={label}><Input value={p[key]} onChange={(e) => setProject(i, { [key]: e.target.value })} /></Field>)}
              </div>
              <Field label="Project images (one image link per line)"><div className="flex items-start gap-3"><Image className="mt-2 size-5 shrink-0 text-muted-foreground" /><Textarea rows={3} placeholder="https://…/project-image.jpg" value={p.images.join("\n")} onChange={(e) => setProject(i, { images: e.target.value.split("\n") })} /></div></Field>
              <div className="grid gap-3 sm:grid-cols-2">
                {([["challenge", "The challenge"], ["solution", "How you solved it"], ["results", "Results, impact & learnings"]] as const).map(([key, label]) => <div key={key} className={key === "results" ? "sm:col-span-2" : ""}><Field label={label}><Textarea rows={4} value={p[key]} onChange={(e) => setProject(i, { [key]: e.target.value })} /></Field></div>)}
              </div>
              <Field label="Project overview & additional notes">
                <Textarea rows={3} value={p.details} onChange={(e) => setProject(i, { details: e.target.value })} />
              </Field>
              <div>
                <Button size="sm" disabled={writing !== null}
                  onClick={() => runAi(`p${i}`, { kind: "project", name: form.name, role: form.role, title: p.name, details: [p.details, `Contribution: ${p.contribution}`, `Technologies: ${p.technologies}`, `Challenge: ${p.challenge}`, `Solution: ${p.solution}`, `Results: ${p.results}`].join("\n"), skills: form.skills }, (t) => setProject(i, { description: t }))}>
                  {writing === `p${i}` ? "Writing…" : <><Sparkles className="size-4" />Write detailed description with AI</>}
                </Button>
              </div>
              <Field label="Description shown on your portfolio">
                <Textarea rows={8} value={p.description} onChange={(e) => setProject(i, { description: e.target.value })} />
              </Field>
              <Button variant="ghost" size="sm" className="justify-self-start text-xs text-muted-foreground hover:text-destructive"
                onClick={() => set("projects", form.projects.filter((_, j) => j !== i))}>Remove project</Button>
            </article>
          ))}
        </section>

        <section className="grid gap-4 rounded-sm bg-secondary p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold">Public portfolio</p>
              <p className="text-sm text-muted-foreground">Anyone with the link can view it. Save to apply.</p>
            </div>
            <Switch aria-label="Public portfolio" checked={form.is_public} onCheckedChange={(v) => set("is_public", v)} />
          </div>
          {form.is_public && <PortfolioShare slug={form.slug} isPublic={savedPublic ?? data?.is_public ?? false} />}
        </section>

        <div className="flex justify-between">
          <Button variant="ghost" className="text-destructive" onClick={remove}>Delete portfolio</Button>
          <Button onClick={save} disabled={saving} className="h-11">{saving ? "Saving…" : "Save portfolio ↗"}</Button>
        </div>
      </main>
      <Dialog open={preview} onOpenChange={setPreview}><DialogContent className="max-h-[94dvh] w-[96vw] max-w-6xl overflow-y-auto p-0"><DialogTitle className="sr-only">Portfolio preview</DialogTitle><PortfolioView portfolio={{ ...form, skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean) }} /></DialogContent></Dialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label className="eyebrow-label">{label}</Label>
      {children}
    </div>
  );
}
