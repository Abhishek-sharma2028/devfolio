export type PortfolioProject = {
  name: string;
  link: string;
  details: string;
  description: string;
  category: string;
  year: string;
  contribution: string;
  technologies: string;
  challenge: string;
  solution: string;
  results: string;
  repository: string;
  video: string;
  images: string[];
};

export const themes = [
  { id: "editorial", name: "Editorial", caption: "Serif · timeless" },
  { id: "noir", name: "Noir", caption: "Dark · cinematic" },
  { id: "studio", name: "Studio", caption: "Pink · expressive" },
  { id: "botanical", name: "Botanical", caption: "Green · considered" },
  { id: "terminal", name: "Terminal", caption: "Mono · technical" },
  { id: "swiss", name: "Swiss", caption: "Red · graphic" },
  { id: "bento", name: "Bento", caption: "Modular · product-led" },
  { id: "brutalist", name: "Brutalist", caption: "Acid · uncompromising" },
  { id: "aurora", name: "Aurora", caption: "Dark · immersive" },
  { id: "blueprint", name: "Blueprint", caption: "Precise · systems-led" },
  { id: "montage", name: "Montage", caption: "Bold type · kinetic work" },
  { id: "maze", name: "Maze", caption: "Explore · discover · connect" },
] as const;
export type PortfolioTheme = typeof themes[number]["id"];
export function parseTheme(value: unknown): PortfolioTheme {
  return themes.find((t) => t.id === value)?.id ?? "editorial";
}
export const profileFields = [
  ["headline", "Personal headline"], ["availability", "Availability"],
  ["email", "Public contact email"], ["website", "Website link"],
  ["github", "GitHub link"], ["linkedin", "LinkedIn link"],
  ["resume", "Résumé link"], ["portrait", "Profile image link"],
  ["experience", "Experience"], ["education", "Education"],
  ["achievements", "Achievements & certifications"], ["interests", "Interests"],
] as const;
export type PortfolioProfile = Record<typeof profileFields[number][0], string>;
export function parseProfile(value: unknown): PortfolioProfile {
  const source = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const profile = Object.fromEntries(profileFields.map(([key]) => [key, String(source[key] ?? "")])) as PortfolioProfile;
  if (!profile.portrait) {
    const legacyPortrait = ["photo", "photoUrl", "photo_url", "avatar", "avatarUrl", "avatar_url", "image", "imageUrl", "image_url"]
      .map((key) => source[key])
      .find((candidate): candidate is string => typeof candidate === "string" && Boolean(candidate.trim()));
    profile.portrait = legacyPortrait?.trim() ?? "";
  }
  return profile;
}
export function emptyProject(): PortfolioProject {
  return { name: "", link: "", details: "", description: "", category: "", year: "", contribution: "", technologies: "", challenge: "", solution: "", results: "", repository: "", video: "", images: [] };
}
export function safeUrl(value: string): string | undefined {
  try { const url = new URL(value); return ["http:", "https:"].includes(url.protocol) ? url.href : undefined; } catch { return undefined; }
}
export function portfolioShareUrl(origin: string, slug: string, isPublic: boolean): string | undefined {
  if (!isPublic || !slug) return undefined;
  try {
    const url = new URL(origin);
    if (url.protocol !== "https:" || url.hostname === "localhost" || url.hostname.endsWith(".localhost") || url.hostname === "127.0.0.1" || url.hostname.startsWith("id-preview--")) return undefined;
    return `${url.origin}/p/${encodeURIComponent(slug)}`;
  } catch { return undefined; }
}
export function videoEmbed(value: string): string | undefined {
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtu.be") {
      const id = host === "youtu.be" ? url.pathname.slice(1) : url.searchParams.get("v") || url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1];
      if (id && /^[\w-]{11}$/.test(id)) return `https://www.youtube-nocookie.com/embed/${id}`;
    }
    if (host === "vimeo.com" && /^\/\d+$/.test(url.pathname)) return `https://player.vimeo.com/video${url.pathname}`;
  } catch { return undefined; }
  return undefined;
}

export function slugify(input: string) {
  const base = input.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
  return `${base || "portfolio"}-${Math.random().toString(36).slice(2, 7)}`;
}

export function parseProjects(value: unknown): PortfolioProject[] {
  if (!Array.isArray(value)) return [];
  return value.map((p) => {
    const o = (p ?? {}) as Record<string, unknown>;
    const imageValues = [
      o["images"], o["gallery"], o["media"], o["image"], o["imageUrl"], o["image_url"],
      o["thumbnail"], o["thumbnailUrl"], o["thumbnail_url"], o["cover"], o["coverImage"], o["cover_image"],
    ];
    const images = imageValues.flatMap((candidate) => {
      const values = Array.isArray(candidate) ? candidate : candidate == null ? [] : [candidate];
      return values.flatMap((image) => {
        if (typeof image === "string") return image.split(/\r?\n/);
        if (image && typeof image === "object") {
          const item = image as Record<string, unknown>;
          const url = item["url"] ?? item["src"] ?? item["href"];
          return typeof url === "string" ? [url] : [];
        }
        return [];
      });
    }).map((image) => image.trim()).filter(Boolean);
    return {
      ...emptyProject(),
      name: String(o["name"] ?? ""),
      link: String(o["link"] ?? ""),
      details: String(o["details"] ?? ""),
      description: String(o["description"] ?? ""),
      ...Object.fromEntries(["category", "year", "contribution", "technologies", "challenge", "solution", "results", "repository", "video"].map((key) => [key, String(o[key] ?? "")])),
      images: [...new Set(images)],
    };
  });
}
