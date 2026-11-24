import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Input = { kind: "project" | "bio"; name: string; role: string; title: string; details: string; skills: string };

const clip = (v: unknown, n: number) => String(v ?? "").slice(0, n);

export const polishWithAi = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: Input): Input => ({
    kind: d?.kind === "bio" ? "bio" : "project",
    name: clip(d?.name, 120),
    role: clip(d?.role, 120),
    title: clip(d?.title, 160),
    details: clip(d?.details, 4000),
    skills: clip(d?.skills, 400),
  }))
  .handler(async ({ data }) => {
    if (data.details.trim().length < 10) {
      return { ok: false as const, error: "Add a few more details first so the AI has something to work with." };
    }
    const { writeDescription, AiWriterError } = await import("./ai-writer.server");
    const instructions =
      data.kind === "bio"
        ? "You write short, warm, confident first-person 'About me' bios for student developer portfolios. 2-3 sentences, under 70 words. No hashtags, no emoji, no clichés like 'passionate'. Return only the bio text."
        : "You write detailed portfolio project case studies for student developers. Write 3-5 readable paragraphs, 200-350 words, covering the overview, creator contribution, technical approach, challenges and solutions, and outcomes when supplied. Use only facts from the notes; never invent metrics or accomplishments. Concrete, plain, confident. No hashtags, no emoji, no markdown. Return only the description.";
    const prompt = [
      `Creator: ${data.name || "unknown"} (${data.role || "developer"})`,
      data.skills && `Skills: ${data.skills}`,
      data.kind === "project" && `Project name: ${data.title || "untitled"}`,
      `Raw notes from the creator:\n${data.details}`,
    ]
      .filter(Boolean)
      .join("\n");
    try {
      return { ok: true as const, text: await writeDescription(prompt, instructions) };
    } catch (e) {
      return { ok: false as const, error: e instanceof AiWriterError ? e.message : "Something went wrong. Please try again." };
    }
  });
