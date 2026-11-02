// Run: npm test
import test from "node:test";
import assert from "node:assert/strict";
import { analyzeAnswer, brandToken, scoreCheck } from "./analyze.ts";

const domain = "smilecare-dental.co.in";

test("brandToken drops the TLD and co.in", () => {
  assert.equal(brandToken(domain), "smilecaredental");
  assert.equal(brandToken("example.com"), "example");
});

test("finds the business and its list position", () => {
  const text = [
    "1. **Orchid Dental Care** - well reviewed",
    "2. **Nova Dental Studio** - modern clinic",
    "3. **SmileCare Dental** - family dentistry",
  ].join("\n");
  const a = analyzeAnswer(text, [], domain);
  assert.equal(a.mentioned, true);
  assert.equal(a.position, 3);
  assert.deepEqual(a.competitors, ["Orchid Dental Care", "Nova Dental Studio"]);
});

test("not mentioned when absent", () => {
  const a = analyzeAnswer("1. **Orchid Dental Care** - good", [], domain);
  assert.equal(a.mentioned, false);
  assert.equal(a.position, null);
});

test("a citation of the business's own site counts as a mention", () => {
  const a = analyzeAnswer("1. **Orchid Dental Care** - good", ["https://www.smilecare-dental.co.in/about"], domain);
  assert.equal(a.mentioned, true);
});

test("score weights top-3 fully and other mentions at 0.6", () => {
  const mk = (mentioned: boolean, position: number | null) => ({
    mentioned,
    position,
    competitors: ["Orchid Dental Care"],
    citedUrls: ["https://www.practo.com/pune"],
  });
  // 1 top-3 (1.0) + 1 at position 5 (0.6) + 2 misses = 1.6 / 4 = 40
  const r = scoreCheck([mk(true, 1), mk(true, 5), mk(false, null), mk(false, null)], domain, "Pune");
  assert.equal(r.score, 40);
  assert.equal(r.mentions, 2);
  assert.equal(r.total, 4);
  assert.equal(r.competitors[0].name, "Orchid Dental Care");
  assert.equal(r.sources[0].domain, "practo.com");
});

test("empty input scores 0 without dividing by zero", () => {
  assert.equal(scoreCheck([], domain, "Pune").score, 0);
});
