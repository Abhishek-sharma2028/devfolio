import { describe, expect, it } from "vitest";
import { parseProjects, parseProfile, parseTheme, safeUrl, videoEmbed, themes, portfolioShareUrl } from "@/lib/portfolio";

describe("Rich portfolio data", () => {
  it("gives public portfolios a stable link usable on LinkedIn", () => {
    expect(portfolioShareUrl("https://devfolio.lovable.app", "arjun-123", true)).toBe("https://devfolio.lovable.app/p/arjun-123");
  });
  it("does not offer a showcase link for private portfolios", () => {
    expect(portfolioShareUrl("https://devfolio.lovable.app", "arjun-123", false)).toBeUndefined();
  });
  it("never presents a protected preview or local address as a public link", () => {
    expect(portfolioShareUrl("https://id-preview--project.lovable.app", "arjun-123", true)).toBeUndefined();
    expect(portfolioShareUrl("http://localhost:8080", "arjun-123", true)).toBeUndefined();
  });
  it("keeps project images, videos and detailed case studies", () => {
    const [project] = parseProjects([{ name: "Atlas", images: ["https://example.com/a.jpg"], video: "https://youtu.be/dQw4w9WgXcQ", challenge: "Slow searches", solution: "Indexed queries", results: "Faster searches" }]);
    expect(project?.images).toEqual(["https://example.com/a.jpg"]);
    expect(project?.challenge).toBe("Slow searches");
    expect(project?.solution).toBe("Indexed queries");
    expect(project?.results).toBe("Faster searches");
    expect(project?.video).toBe("https://youtu.be/dQw4w9WgXcQ");
  });
  it("keeps old portfolios compatible", () => { expect(parseProjects([{ name: "Old" }])[0]?.images).toEqual([]); expect(parseProfile(null).experience).toBe(""); });
  it("recovers images from legacy portfolio fields", () => {
    expect(parseProjects([{ image: " https://example.com/cover.jpg ", gallery: [{ src: "https://example.com/detail.jpg" }] }])[0]?.images)
      .toEqual(["https://example.com/detail.jpg", "https://example.com/cover.jpg"]);
    expect(parseProjects([{ images: "https://example.com/one.jpg\nhttps://example.com/two.jpg" }])[0]?.images)
      .toEqual(["https://example.com/one.jpg", "https://example.com/two.jpg"]);
    expect(parseProfile({ photo: "https://example.com/person.jpg" }).portrait).toBe("https://example.com/person.jpg");
  });
  it("supports ten themes with a safe fallback", () => { expect(themes.length).toBe(10); expect(parseTheme("aurora")).toBe("aurora"); expect(parseTheme("unknown")).toBe("editorial"); });
  it("embeds supported video links only", () => { expect(videoEmbed("https://youtu.be/dQw4w9WgXcQ")).toBe("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"); expect(videoEmbed("https://vimeo.com/123456")).toBe("https://player.vimeo.com/video/123456"); expect(videoEmbed("https://youtube.com.evil.test/watch?v=dQw4w9WgXcQ")).toBeUndefined(); });
  it("rejects executable links", () => { expect(safeUrl("javascript:alert(1)")).toBeUndefined(); expect(safeUrl("https://example.com")).toBe("https://example.com/"); });
});
