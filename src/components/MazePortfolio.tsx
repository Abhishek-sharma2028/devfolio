import { useState, type KeyboardEvent } from "react";
import { ArrowUpRight, Compass, Grid3X3, List, Mail } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { parseProfile, parseProjects, safeUrl, type PortfolioProject } from "@/lib/portfolio";

type Portfolio = {
  name: string;
  role: string;
  location: string;
  bio: string;
  skills: string[];
  projects: unknown;
  profile: unknown;
};

export function MazePortfolio({
  portfolio: p,
  imageSources,
}: {
  portfolio: Portfolio;
  imageSources: Record<string, string>;
}) {
  const profile = parseProfile(p.profile);
  const projects = parseProjects(p.projects);
  const rooms = [
    "Start",
    "Story",
    "Skills",
    ...Array.from({ length: 3 }, (_, i) => projects[i]?.name || `Project ${i + 1}`),
    "Experience",
    "Interests",
    "Contact",
  ];
  const [active, setActive] = useState(0);
  const [listView, setListView] = useState(false);
  const [selected, setSelected] = useState<PortfolioProject | null>(null);
  const portrait = safeUrl(profile.portrait);
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email) ? profile.email : "";
  const roomContent = (index: number) => {
    if (index === 0)
      return (
        <>
          <p className="maze-overline">01 / ENTRY POINT</p>
          <h2>
            Welcome to my world<span>.</span>
          </h2>
          <p>{profile.headline || p.bio || "Explore the chapters of my work."}</p>
          <p className="maze-hint">Choose a room on the map to continue exploring.</p>
        </>
      );
    if (index === 1)
      return (
        <>
          <p className="maze-overline">02 / THE STORY</p>
          <h2>
            About me<span>.</span>
          </h2>
          <p>
            {p.bio || profile.headline || "A developer building thoughtful things for the web."}
          </p>
          <p>{profile.education}</p>
        </>
      );
    if (index === 2)
      return (
        <>
          <p className="maze-overline">03 / THE TOOLKIT</p>
          <h2>
            What I use<span>.</span>
          </h2>
          <div className="maze-tags">
            {p.skills.map((skill, i) => (
              <span key={`${skill}-${i}`}>{skill}</span>
            ))}
          </div>
        </>
      );
    if (index >= 3 && index <= 5) {
      const project = projects[index - 3];
      if (!project)
        return (
          <>
            <p className="maze-overline">{String(index + 1).padStart(2, "0")} / SELECTED WORK</p>
            <h2>
              Coming soon<span>.</span>
            </h2>
            <p>New work will appear in this room.</p>
          </>
        );
      const cover = project.images.find((url) => safeUrl(url));
      return (
        <>
          <p className="maze-overline">
            {String(index + 1).padStart(2, "0")} / SELECTED WORK · {project.year}
          </p>
          <h2>
            {project.name}
            <span>.</span>
          </h2>
          {cover && (
            <img
              className="maze-project-image"
              src={imageSources[cover] ?? cover}
              alt={`${project.name} project preview`}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          )}
          <p>{project.description || project.details || project.challenge}</p>
          <button className="maze-action" onClick={() => setSelected(project)}>
            Explore case study <ArrowUpRight size={16} />
          </button>
        </>
      );
    }
    if (index === 6)
      return (
        <>
          <p className="maze-overline">07 / THE JOURNEY</p>
          <h2>
            Experience<span>.</span>
          </h2>
          <p className="whitespace-pre-wrap">
            {profile.experience || "A collection of projects, experiments and collaborations."}
          </p>
          {profile.achievements && <p className="whitespace-pre-wrap">{profile.achievements}</p>}
        </>
      );
    if (index === 7)
      return (
        <>
          <p className="maze-overline">08 / BEYOND CODE</p>
          <h2>
            Curiosity<span>.</span>
          </h2>
          <p>{profile.interests || "The best ideas often start outside the screen."}</p>
        </>
      );
    return (
      <>
        <p className="maze-overline">09 / THE EXIT, OR THE BEGINNING</p>
        <h2>
          Let's connect<span>.</span>
        </h2>
        <p>{profile.availability || "Have a project in mind? Let's talk."}</p>
        <div className="maze-links">
          {email && (
            <a href={`mailto:${email}`}>
              <Mail size={16} /> Email me
            </a>
          )}
          {(
            [
              ["Website", profile.website],
              ["GitHub", profile.github],
              ["LinkedIn", profile.linkedin],
            ] as [string, string][]
          ).map(
            ([label, value]) =>
              safeUrl(value) && (
                <a key={label} href={safeUrl(value)} target="_blank" rel="noopener noreferrer">
                  {label} <ArrowUpRight size={16} />
                </a>
              ),
          )}
        </div>
      </>
    );
  };
  const onMapKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const steps: Record<string, number> = {
      ArrowRight: 1,
      ArrowLeft: -1,
      ArrowDown: 3,
      ArrowUp: -3,
    };
    if (!(event.key in steps)) return;
    event.preventDefault();
    setActive((current) => Math.max(0, Math.min(8, current + (steps[event.key] ?? 0))));
  };
  return (
    <div data-portfolio-theme="maze" className="portfolio-view maze-portfolio">
      <main className="maze-shell">
        <header className="maze-header">
          <a href="#maze-top" className="maze-logo">
            <Compass size={22} /> {p.name || "Portfolio"}
            <span> / MAZE</span>
          </a>
          <span>{p.location || "Explore from anywhere"}</span>
          <button onClick={() => setListView((value) => !value)} aria-pressed={listView}>
            {listView ? (
              <>
                <Grid3X3 size={16} /> Map view
              </>
            ) : (
              <>
                <List size={16} /> List view
              </>
            )}
          </button>
        </header>
        <section id="maze-top" className="maze-intro">
          <div>
            <p className="maze-overline">
              AN INTERACTIVE PORTFOLIO · {String(rooms.length).padStart(2, "0")} ROOMS
            </p>
            <h1>
              Find your way
              <br />
              through <em>my work.</em>
            </h1>
            <p>
              {p.role || "Creative developer"} · {p.name}
            </p>
          </div>
          {portrait && (
            <img
              src={imageSources[portrait] ?? portrait}
              alt={`Illustrative portrait for ${p.name}`}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          )}
        </section>
        {listView ? (
          <div className="maze-list" aria-label="Portfolio chapters">
            {rooms.map((room, index) => (
              <section key={`${room}-${index}`} className="maze-list-room">
                <span>
                  {String(index + 1).padStart(2, "0")} / {room}
                </span>
                <div>{roomContent(index)}</div>
              </section>
            ))}
          </div>
        ) : (
          <div className="maze-explorer">
            <div className="maze-map-wrap">
              <div className="maze-map-heading">
                <span>THE MAP</span>
                <span>USE ARROW KEYS OR SELECT A ROOM</span>
              </div>
              <div className="maze-map" onKeyDown={onMapKeyDown} aria-label="Portfolio maze map">
                {rooms.map((room, index) => (
                  <button
                    key={`${room}-${index}`}
                    className={`maze-cell maze-cell-${index}${active === index ? " is-active" : ""}`}
                    onClick={() => setActive(index)}
                    aria-current={active === index ? "step" : undefined}
                  >
                    <span className="maze-cell-number">{String(index + 1).padStart(2, "0")}</span>
                    <span className="maze-cell-title">{room}</span>
                    {active === index && (
                      <span className="maze-marker" aria-hidden="true">
                        ✦
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <p className="maze-map-foot">Each room holds a piece of the story. Take any route.</p>
            </div>
            <article key={active} className="maze-room" aria-live="polite">
              {roomContent(active)}
              <div className="maze-room-controls">
                <button
                  onClick={() => setActive((value) => Math.max(0, value - 1))}
                  disabled={active === 0}
                >
                  ← Previous
                </button>
                <span>
                  {String(active + 1).padStart(2, "0")} / {String(rooms.length).padStart(2, "0")}
                </span>
                <button
                  onClick={() => setActive((value) => Math.min(8, value + 1))}
                  disabled={active === 8}
                >
                  Next →
                </button>
              </div>
            </article>
          </div>
        )}
        <footer className="maze-footer">
          {p.name} · Made with Devfolio{" "}
          <span>Website creators: Abhishek Sharma and Alok kumar singh</span>
        </footer>
      </main>
      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent
          data-portfolio-theme="maze"
          className="portfolio-view maze-dialog max-h-[90dvh] max-w-3xl overflow-y-auto bg-background text-foreground"
        >
          {selected && (
            <>
              <DialogTitle className="text-3xl">{selected.name}</DialogTitle>
              <DialogDescription>
                {[selected.category, selected.year, selected.technologies]
                  .filter(Boolean)
                  .join(" · ")}
              </DialogDescription>
              {selected.images
                .filter((url) => safeUrl(url))
                .map((url, i) => (
                  <img
                    key={`${url}-${i}`}
                    src={imageSources[url] ?? url}
                    alt={`${selected.name} image ${i + 1}`}
                    className="max-h-96 w-full rounded-md object-contain"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                ))}
              {[
                ["Overview", selected.description || selected.details],
                ["The challenge", selected.challenge],
                ["The solution", selected.solution],
                ["My contribution", selected.contribution],
                ["Results & learnings", selected.results],
              ].map(
                ([heading, value]) =>
                  value && (
                    <section key={heading}>
                      <h3 className="font-semibold">{heading}</h3>
                      <p className="whitespace-pre-wrap text-muted-foreground">{value}</p>
                    </section>
                  ),
              )}
              <div className="maze-links">
                {(
                  [
                    ["Live project", selected.link],
                    ["Source code", selected.repository],
                  ] as [string, string][]
                ).map(
                  ([label, value]) =>
                    safeUrl(value) && (
                      <a
                        key={label}
                        href={safeUrl(value)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {label} <ArrowUpRight size={16} />
                      </a>
                    ),
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
