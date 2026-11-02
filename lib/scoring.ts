// Reads one raw AI answer and scores a whole check. Pure functions, no I/O.
// Relative imports only so `node --test` can run the tests without a bundler.
import { bands, quickFixes, TOTAL_ANSWERS, type BandLabel } from "../content/check.ts";
import type { CheckResult } from "./schemas.ts";

export type Analysis = {
  mentioned: boolean;
  position: number | null; // 1-based place in the answer's list, null if mentioned but not ranked
  competitors: string[];
  citedUrls: string[];
};

const strip = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const SECOND_LEVEL = new Set(["co", "com", "org", "net", "gov", "ac", "edu"]);
const LEGAL_SUFFIX = /\b(pvt\.?|private|ltd\.?|limited|llp|inc\.?|llc)\b/gi;

/** "SmileCare Dental Pvt Ltd" and "smilecare dental" count as the same name. */
export const normalizeName = (name: string) => strip(name.replace(LEGAL_SUFFIX, ""));

/** "smilecare-dental.co.in" -> "smilecaredental" */
export function brandToken(domain: string): string {
  const labels = domain.toLowerCase().split(".");
  labels.pop(); // TLD
  if (labels.length > 1 && SECOND_LEVEL.has(labels[labels.length - 1])) labels.pop();
  return strip(labels[labels.length - 1] ?? "");
}

export const hostOf = (url: string): string | null => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
};

// shortcut: the business is matched by its domain name, not its trading name. Upgrade by
// fetching the site's <title> as an extra alias if names differ a lot from domains.
export function analyzeAnswer(text: string, citations: string[], domain: string): Analysis {
  const token = brandToken(domain);
  const citedUrls = [...new Set([...citations, ...(text.match(/https?:\/\/[^\s)\]>"']+/g) ?? [])])];

  // Business names come from list lines: "1. **Name** - why", "- Name: why", "* Name".
  const items: string[] = [];
  for (const line of text.split("\n")) {
    const m = line.match(/^\s*(?:\d{1,2}[.)]|[-*\u2022])\s+(.+)$/);
    if (!m) continue;
    const bold = m[1].match(/^\*\*(.+?)\*\*/)?.[1];
    const raw = bold ?? m[1].split(/\s[-\u2013\u2014:]\s|:\s|\s\(/)[0];
    const name = raw.replace(/\[\d+\]|[*_`#]/g, "").trim();
    if (name.length >= 2 && name.length <= 70) items.push(name);
  }

  const matches = (s: string) =>
    token.length >= 4 ? strip(s).includes(token) : new RegExp(`\\b${token}\\b`).test(s.toLowerCase());

  const listIndex = items.findIndex(matches);
  const citedOwnSite = citedUrls.some((u) => {
    const host = hostOf(u);
    return host === domain || host?.endsWith(`.${domain}`);
  });
  const mentioned = listIndex >= 0 || matches(text) || text.toLowerCase().includes(domain) || citedOwnSite;

  return {
    mentioned,
    position: listIndex >= 0 ? listIndex + 1 : null,
    competitors: items.filter((n) => !matches(n)).slice(0, 5),
    citedUrls,
  };
}

export function bandFor(score: number): BandLabel {
  return (bands.find((b) => score >= b.min) ?? bands[bands.length - 1]).label;
}

/**
 * Score = sum of weights over all 15 answers / 15 x 100. A top-3 place weighs 1.0, any other mention 0.6
 * (including "mentioned, unranked"), a miss 0. A failed call is passed as null and counts as a miss.
 */
export function scoreCheck(analyses: (Analysis | null)[], domain: string, city: string): CheckResult {
  const real = analyses.filter((a): a is Analysis => a !== null);
  const mentioned = real.filter((a) => a.mentioned);
  const weight = mentioned.reduce((sum, a) => sum + (a.position && a.position <= 3 ? 1 : 0.6), 0);
  const score = Math.min(100, Math.round((weight / TOTAL_ANSWERS) * 100));

  const tally = (names: string[], key: (n: string) => string) => {
    const map = new Map<string, { name: string; count: number }>();
    for (const name of names) {
      const k = key(name);
      if (!k) continue;
      const entry = map.get(k) ?? { name, count: 0 };
      entry.count++;
      map.set(k, entry);
    }
    return [...map.values()].sort((a, b) => b.count - a.count);
  };

  const competitors = tally(real.flatMap((a) => a.competitors), normalizeName)
    .slice(0, 3)
    .map(({ name, count }) => ({ name, mentions: count }));

  const sourceHosts = real
    .flatMap((a) => a.citedUrls.map(hostOf))
    .filter((h): h is string => !!h && h !== domain && !h.endsWith(`.${domain}`));
  const sources = tally(sourceHosts, (h) => h).map(({ name, count }) => ({ domain: name, count }));

  return {
    score,
    band: bandFor(score),
    mentionedCount: mentioned.length,
    totalAnswers: TOTAL_ANSWERS,
    competitors,
    topSources: sources.slice(0, 5),
    sourceCount: sources.length,
    quickFix: pickQuickFix(mentioned.length, sources[0]?.domain, city),
    quickFixCount: 1,
  };
}

// Rule-based and conservative: keyed by what is missing, never a claim about rankings.
function pickQuickFix(mentions: number, topSource: string | undefined, city: string) {
  if (mentions === 0) return quickFixes.noMentions.replace("{city}", city);
  if (topSource) return quickFixes.trustedSource.replace("{source}", topSource);
  return quickFixes.faq.replace("{city}", city);
}
