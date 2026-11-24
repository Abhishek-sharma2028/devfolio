import type { Tables } from "@/integrations/supabase/types";
import { parseProfile, parseProjects } from "./portfolio";

export type Match = { id: string; reason: string; score: number };
export type SavedPortfolio = Pick<Tables<"portfolios">, "id" | "user_id" | "name" | "role" | "bio" | "skills" | "projects" | "profile" | "location" | "theme">;

export function ownerCandidates(rows: SavedPortfolio[], userId: string) {
  return rows.filter(row => row.user_id === userId).map(row => ({
    id: row.id, name: row.name, role: row.role, bio: row.bio, skills: row.skills,
    location: row.location, theme: row.theme, profile: parseProfile(row.profile), projects: parseProjects(row.projects),
  }));
}

export function normalizeMatches(matches: Match[], allowedIds: string[]): Match[] {
  const allowed = new Set(allowedIds);
  const best = new Map<string, Match>();
  for (const match of matches) {
    if (!allowed.has(match.id) || !Number.isFinite(match.score) || match.score < 60 || !match.reason.trim()) continue;
    const normalized = { ...match, score: Math.min(100, Math.round(match.score)), reason: match.reason.trim().slice(0, 500) };
    if (normalized.score > (best.get(match.id)?.score ?? -1)) best.set(match.id, normalized);
  }
  return [...best.values()].sort((a, b) => b.score - a.score);
}

export function candidateBatches<T>(items: T[], budget = 60000): T[][] {
  const batches: T[][] = [];
  let batch: T[] = [], size = 0;
  for (const item of items) {
    const length = JSON.stringify(item).length;
    if (batch.length && size + length > budget) { batches.push(batch); batch = []; size = 0; }
    batch.push(item); size += length;
  }
  if (batch.length) batches.push(batch);
  return batches;
}