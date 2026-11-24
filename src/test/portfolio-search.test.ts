import { describe, expect, it } from "vitest";
import { candidateBatches, normalizeMatches, ownerCandidates, type SavedPortfolio } from "@/lib/portfolio-search";

const portfolio = (id: string, user_id: string): SavedPortfolio => ({ id, user_id, name: "React portfolio", role: "Developer", bio: "", skills: ["React"], projects: [], profile: {}, location: "", theme: "noir" });
describe("Personal AI portfolio matching", () => {
  it("only supplies the signed-in creator's saved portfolios to AI", () => {
    expect(ownerCandidates([portfolio("mine", "owner"), portfolio("someone-else", "other")], "owner").map(row => row.id)).toEqual(["mine"]);
  });
  it("rejects model-invented and other-owner result IDs", () => {
    expect(normalizeMatches([{ id: "mine", score: 80, reason: "React projects" }, { id: "other", score: 99, reason: "Public portfolio" }], ["mine"]).map(row => row.id)).toEqual(["mine"]);
  });
  it("returns relevant results ranked once per portfolio", () => {
    expect(normalizeMatches([{ id: "a", score: 70, reason: "React" }, { id: "b", score: 95, reason: "React and video" }, { id: "a", score: 80, reason: "React projects" }], ["a", "b"]).map(row => row.id)).toEqual(["b", "a"]);
  });
  it("supports no-match results", () => {
    expect(normalizeMatches([{ id: "a", score: 10, reason: "Unrelated" }], ["a"])).toEqual([]);
  });
  it("batches every saved portfolio without silently dropping rows", () => {
    const rows = [portfolio("first", "owner"), portfolio("last", "owner")];
    expect(candidateBatches(rows, 10).flat()).toEqual(rows);
  });
});