import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, Github, Linkedin, Mail, Play, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { parseProfile, parseProjects, parseTheme, safeUrl, videoEmbed, type PortfolioProject } from "@/lib/portfolio";

type Props = { portfolio: { name: string; role: string; location: string; bio: string; skills: string[]; projects: unknown; profile: unknown; theme: unknown } };

function PortfolioImage({ src, alt, className, fallback }: { src: string; alt: string; className: string; fallback: ReactNode }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  if (failed) return fallback;
  return <img src={src} alt={alt} className={className} loading="lazy" referrerPolicy="no-referrer" onError={() => setFailed(true)} />;
}

function ProjectVideo({ link }: { link: string }) {
  const embed = videoEmbed(link);
  const url = safeUrl(link);
  if (!url) return null;
  if (embed) return <iframe className="aspect-video w-full rounded-md border border-border" src={embed} title="Project video" loading="lazy" allow="fullscreen; picture-in-picture" allowFullScreen />;
  if (/\.(mp4|webm)(\?|$)/i.test(url)) return <video className="aspect-video w-full bg-secondary" src={url} controls preload="metadata" />;
  return <Button asChild variant="outline"><a href={url} target="_blank" rel="noopener noreferrer"><Play className="size-4" /> Watch video</a></Button>;
}

function CaseStudy({ project, imageSources }: { project: PortfolioProject; imageSources: Record<string, string> }) {
  return <>
    <DialogTitle className="pr-6 text-3xl">{project.name || "Untitled project"}</DialogTitle>
    <DialogDescription>{[project.category, project.year, project.contribution].filter(Boolean).join(" · ") || "Project case study"}</DialogDescription>
    {project.images.filter((url) => safeUrl(url)).map((url, i) => <PortfolioImage key={`${url}-${i}`} src={imageSources[url] ?? url} alt={`${project.name || "Project"} — image ${i + 1}`} className="max-h-96 w-full rounded-md bg-secondary object-contain" fallback={<div className="grid aspect-video w-full place-items-center rounded-md bg-secondary px-6 text-center text-sm text-muted-foreground">Image could not be loaded</div>} />)}
    <p className="whitespace-pre-wrap leading-relaxed">{project.description || project.details}</p>
    {[["Technologies", project.technologies], ["My contribution", project.contribution], ["The challenge", project.challenge], ["The solution", project.solution], ["Results & learnings", project.results]].map(([label, text]) => text ? <section key={label}><h3 className="mb-2 text-lg font-semibold">{label}</h3><p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">{text}</p></section> : null)}
    <ProjectVideo link={project.video} />
    <div className="flex flex-wrap gap-3">{[["View live project", project.link], ["Source code", project.repository]].map(([label, url]) => safeUrl(url ?? "") ? <Button asChild key={label}><a href={url} target="_blank" rel="noopener noreferrer">{label}<ArrowUpRight className="size-4" /></a></Button> : null)}</div>
  </>;
}

export function PortfolioView({ portfolio: p, imageSources = {} }: Props & { imageSources?: Record<string, string> }) {
  const profile = parseProfile(p.profile);
  const projects = parseProjects(p.projects);
  const theme = parseTheme(p.theme);
  const [selected, setSelected] = useState<PortfolioProject | null>(null);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: 0.08 });
    root.current?.querySelectorAll(".portfolio-reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [p]);
  return <div ref={root} data-portfolio-theme={theme} className="portfolio-view min-h-full bg-background text-foreground">
    <main className="mx-auto max-w-6xl px-6 py-12 sm:px-10 sm:py-20">
      {theme === "montage" && <nav className="montage-nav" aria-label="Portfolio sections"><a href="#montage-top">{p.name || "Portfolio"}</a><div><a href="#montage-stack">Stack</a><a href="#montage-work">Work</a><a href="#montage-about">About</a></div><a className="montage-contact" href={profile.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email) ? `mailto:${profile.email}` : "#montage-about"}>Say hello <ArrowUpRight className="size-4" /></a></nav>}
      <header id="montage-top" className="portfolio-intro grid items-start gap-8 border-b border-border pb-12 sm:grid-cols-[1fr_auto]">
        <div className="min-w-0">
          <div className="mb-6 flex flex-wrap items-center gap-3"><span className="font-mono text-xs text-muted-foreground">{p.location || "Independent creator"}</span>{profile.availability && <span className="border border-border px-3 py-1 text-xs"><span className="availability-dot" />{profile.availability}</span>}</div>
          <h1 className="portfolio-name break-words text-4xl font-semibold sm:text-6xl">{p.name || "Your name"}<span className="text-highlight">.</span></h1>
          <p className="mt-3 text-xl text-muted-foreground">{p.role || "Your role"}</p>
          {profile.headline && <p className="mt-6 max-w-xl text-2xl leading-snug">{profile.headline}</p>}
          {p.bio && <p className="mt-6 max-w-2xl whitespace-pre-wrap leading-relaxed text-muted-foreground">{p.bio}</p>}
          <div className="mt-6 flex flex-wrap gap-2">{p.skills.map((skill, i) => <span key={`${skill}-${i}`} className="border border-border px-3 py-1.5 font-mono text-xs">{skill}</span>)}</div>
          <div className="mt-6 flex flex-wrap gap-2">
            {profile.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email) && <Button asChild variant="outline"><a href={`mailto:${profile.email}`}><Mail className="size-4" /> Contact</a></Button>}
            {[["GitHub", profile.github, Github], ["LinkedIn", profile.linkedin, Linkedin], ["Website", profile.website, ArrowUpRight], ["Résumé", profile.resume, ArrowUpRight]].map(([label, url, Icon]) => { const href = safeUrl(String(url)); const Symbol = Icon as typeof Github; return href ? <Button asChild variant="ghost" key={String(label)}><a href={href} target="_blank" rel="noopener noreferrer"><Symbol className="size-4" />{String(label)}</a></Button> : null; })}
          </div>
        </div>
        {safeUrl(profile.portrait) ? <PortfolioImage src={imageSources[profile.portrait] ?? profile.portrait} alt={imageSources[profile.portrait] ? `Illustrative portrait for ${p.name || "example portfolio"}` : `${p.name || "Portfolio owner"} profile portrait`} className="aspect-[4/5] w-full max-w-sm justify-self-center rounded-md object-cover sm:w-72 sm:justify-self-end lg:w-80" fallback={<ProfileArtwork name={p.name} />} /> : <ProfileArtwork name={p.name} />}
      </header>
      {theme === "montage" && <section id="montage-stack" className="montage-manifesto"><span>// What I work with</span><strong>I BUILD <mark>FRONT.</mark><br />I BUILD <mark>BACK.</mark></strong><p>{p.skills.join("  /  ")}</p></section>}
      <section id="montage-work" className="py-12">
        <div className="mb-8 flex items-baseline justify-between"><h2 className="portfolio-heading text-3xl font-semibold">Selected work</h2><span className="font-mono text-sm text-muted-foreground">{String(projects.length).padStart(2, "0")} projects</span></div>
        <div className="portfolio-project-grid grid gap-6 sm:grid-cols-2">
          {projects.map((project, i) => <article key={i} className="portfolio-reveal portfolio-project group overflow-hidden rounded-md border border-border bg-card">
            <Button variant="ghost" onClick={() => setSelected(project)} className="h-auto w-full flex-col items-stretch gap-0 rounded-none p-0 text-left whitespace-normal hover:bg-card" aria-label={`Open ${project.name || "Untitled project"}`}>
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary">
                {safeUrl(project.images[0] ?? "") ? <PortfolioImage src={imageSources[project.images[0] ?? ""] ?? project.images[0]} alt={`${project.name || "Project"} cover`} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" fallback={<ProjectArtwork project={project} index={i} />} /> : <ProjectArtwork project={project} index={i} />}
                {project.video && <span className="absolute left-4 bottom-4 flex items-center gap-2 bg-background px-3 py-2 text-xs"><Play className="size-3" /> Video</span>}
              </div>
              <div className="w-full p-5"><div className="mb-3 flex items-center justify-between gap-3 font-mono text-xs text-muted-foreground"><span>{project.category || "Case study"}</span><span>{project.year}</span></div><div className="flex items-start justify-between gap-4"><h3 className="break-words text-2xl font-semibold">{project.name || "Untitled project"}</h3><Plus className="mt-1 size-5 shrink-0 transition-transform duration-300 group-hover:rotate-90" /></div><p className="mt-3 line-clamp-2 font-normal leading-relaxed text-muted-foreground">{project.description || project.details || project.challenge}</p></div>
            </Button>
          </article>)}
        </div>
      </section>
      <div id="montage-about" className="grid gap-10 border-t border-border py-10 sm:grid-cols-2">{[["Experience", profile.experience], ["Education", profile.education], ["Achievements", profile.achievements], ["Outside of work", profile.interests]].map(([label, text]) => text && <section className="portfolio-reveal" key={label}><h2 className="portfolio-heading mb-4 text-2xl font-semibold">{label}</h2><p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">{text}</p></section>)}</div>
      <footer className="border-t border-border pt-6 font-mono text-xs text-muted-foreground">{p.name || "Portfolio"} · Made with Devfolio<br />Website creators: Abhishek Sharma and Alok kumar singh</footer>
    </main>
    <Dialog open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null); }}><DialogContent data-portfolio-theme={theme} className="portfolio-view max-h-[90dvh] max-w-3xl overflow-y-auto bg-background text-foreground">{selected && <CaseStudy project={selected} imageSources={imageSources} />}</DialogContent></Dialog>
  </div>;
}

function ProjectArtwork({ project, index }: { project: PortfolioProject; index: number }) {
  return <div className="project-art h-full w-full p-6"><span className="font-mono text-xs">{project.category || "PROJECT"}</span><span className="project-art-number">{String(index + 1).padStart(2, "0")}</span><ArrowUpRight className="absolute bottom-6 right-6 size-10" /></div>;
}

function ProfileArtwork({ name }: { name: string }) {
  const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join("").toUpperCase() || "?";
  return <div className="grid aspect-[4/5] w-full max-w-sm place-items-center justify-self-center rounded-md bg-secondary font-serif text-6xl sm:w-72 sm:justify-self-end lg:w-80" aria-label="Profile image unavailable">{initials}</div>;
}
