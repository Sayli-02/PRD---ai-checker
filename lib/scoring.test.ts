// Run: npm test
import test from "node:test";
import assert from "node:assert/strict";
import { analyzeAnswer, bandFor, brandToken, normalizeName, scoreCheck, type Analysis } from "./scoring.ts";
import { bulletsWithCitations, numberedBold, paragraphOnly, withOwnSiteCitation } from "./fixtures/answers.ts";
import { buildQuestions } from "./questions.ts";

const domain = "smilecare-dental.co.in";

test("brandToken drops the TLD and co.in", () => {
  assert.equal(brandToken(domain), "smilecaredental");
  assert.equal(brandToken("example.com"), "example");
});

test("normalizeName ignores legal suffixes and punctuation", () => {
  assert.equal(normalizeName("SmileCare Dental Pvt. Ltd."), normalizeName("smilecare dental"));
});

test("finds the business and its list position, even with a Pvt Ltd suffix", () => {
  const a = analyzeAnswer(numberedBold, [], domain);
  assert.equal(a.mentioned, true);
  assert.equal(a.position, 3);
  assert.deepEqual(a.competitors, ["Orchid Dental Care", "Nova Dental Studio", "Pune Dental Hub"]);
});

test("reads bullet lists and strips citation markers", () => {
  const a = analyzeAnswer(bulletsWithCitations, [], "orchid-dental.com");
  assert.equal(a.position, 1);
  assert.deepEqual(a.competitors, ["Pune Dental Hub", "Nova Dental Studio"]);
});

test("a paragraph with no list is mentioned but unranked", () => {
  const a = analyzeAnswer(paragraphOnly, [], "orchid-dental.com");
  assert.equal(a.mentioned, true);
  assert.equal(a.position, null);
});

test("not mentioned when absent", () => {
  const a = analyzeAnswer(withOwnSiteCitation, [], domain);
  assert.equal(a.mentioned, false);
  assert.equal(a.position, null);
});

test("a citation of the business's own site counts as a mention", () => {
  const a = analyzeAnswer(withOwnSiteCitation, ["https://www.smilecare-dental.co.in/about"], domain);
  assert.equal(a.mentioned, true);
});

const mk = (mentioned: boolean, position: number | null, competitors = ["Orchid Dental Care"]): Analysis => ({
  mentioned,
  position,
  competitors,
  citedUrls: ["https://www.practo.com/pune"],
});

test("score divides by all 15 answers and weights top-3 at 1.0, others at 0.6", () => {
  // 10 top-3 mentions (10) + 2 at position 5 (1.2) + 3 misses = 11.2 / 15 = 74.67 -> 75
  const analyses = [
    ...Array.from({ length: 10 }, () => mk(true, 2)),
    mk(true, 5),
    mk(true, null),
    mk(false, null),
    mk(false, null),
    mk(false, null),
  ];
  const r = scoreCheck(analyses, domain, "Pune");
  assert.equal(r.score, 75);
  assert.equal(r.band, "Good");
  assert.equal(r.mentionedCount, 12);
  assert.equal(r.totalAnswers, 15);
  assert.deepEqual(r.competitors[0], { name: "Orchid Dental Care", mentions: 15 });
  assert.equal(r.topSources[0].domain, "practo.com");
});

test("failed calls (null) count as misses, not as missing answers", () => {
  const r = scoreCheck([mk(true, 1), ...Array.from({ length: 14 }, () => null)], domain, "Pune");
  assert.equal(r.score, 7); // 1 / 15
  assert.equal(r.totalAnswers, 15);
});

test("empty input scores 0 and picks the no-mentions fix", () => {
  const r = scoreCheck([], domain, "Pune");
  assert.equal(r.score, 0);
  assert.equal(r.band, "Low");
  assert.match(r.quickFix, /Pune/);
  assert.deepEqual(r.competitors, []);
});

test("bands switch at 40, 70 and 85", () => {
  assert.deepEqual([0, 39, 40, 69, 70, 84, 85, 100].map(bandFor), ["Low", "Low", "Fair", "Fair", "Good", "Good", "Strong", "Strong"]);
});

test("builds five questions from category and city", () => {
  const q = buildQuestions("dental clinics", "Pune");
  assert.equal(q.length, 5);
  assert.equal(q[0], "best dental clinics in Pune");
});
