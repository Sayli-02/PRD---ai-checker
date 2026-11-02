// Reads one raw AI answer and scores a whole check. Pure functions, no I/O.
// Relative imports only so `node --test` can run the tests without a bundler.

export type Analysis = {
  mentioned: boolean;
  position: number | null; // 1-based place in the answer's list, null if not listed
  competitors: string[];
  citedUrls: string[];
};

const strip = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const SECOND_LEVEL = new Set(["co", "com", "org", "net", "gov", "ac", "edu"]);

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
  const citedUrls = [
    ...new Set([...citations, ...(text.match(/https?:\/\/[^\s)\]>"']+/g) ?? [])]),
  ];

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
  const mentioned =
    listIndex >= 0 || matches(text) || text.toLowerCase().includes(domain) || citedOwnSite;

  return {
    mentioned,
    position: listIndex >= 0 ? listIndex + 1 : null,
    competitors: items.filter((n) => !matches(n)).slice(0, 5),
    citedUrls,
  };
}

export type CheckResult = {
  score: number; // 0-100
  mentions: number;
  total: number; // answers that came back
  competitors: { name: string; count: number }[]; // top 3
  sources: { domain: string; count: number }[]; // top 5
  sourceCount: number; // all distinct sites AI quoted
  quickFix: string;
};

/** Score = share of answers that mention the business; a top-3 place counts fully, any other mention 0.6. */
export function scoreCheck(
  analyses: Analysis[],
  domain: string,
  city: string,
): CheckResult {
  const total = analyses.length;
  const mentioned = analyses.filter((a) => a.mentioned);
  const weight = mentioned.reduce((sum, a) => sum + (a.position && a.position <= 3 ? 1 : 0.6), 0);

  const tally = (names: string[]) => {
    const map = new Map<string, { name: string; count: number }>();
    for (const name of names) {
      const k = strip(name);
      if (!k) continue;
      const entry = map.get(k) ?? { name, count: 0 };
      entry.count++;
      map.set(k, entry);
    }
    return [...map.values()].sort((a, b) => b.count - a.count);
  };

  const competitors = tally(analyses.flatMap((a) => a.competitors)).slice(0, 3);
  const sourceHosts = analyses
    .flatMap((a) => a.citedUrls.map(hostOf))
    .filter((h): h is string => !!h && h !== domain && !h.endsWith(`.${domain}`));
  const sources = tally(sourceHosts).map(({ name, count }) => ({ domain: name, count }));

  const score = total ? Math.round((100 * weight) / total) : 0;
  return {
    score,
    mentions: mentioned.length,
    total,
    competitors,
    sources: sources.slice(0, 5),
    sourceCount: sources.length,
    quickFix: quickFix(mentioned.length, sources[0]?.domain, city),
  };
}

function quickFix(mentions: number, topSource: string | undefined, city: string) {
  if (topSource) {
    return `AI tools often quote ${topSource}. Make sure your business has a complete, accurate profile there.`;
  }
  if (mentions === 0) {
    return `Add a clear page for each service you offer, with ${city} and your address in plain text. AI tools quote pages that answer the question directly.`;
  }
  return `Add short answers to common customer questions on your site, such as your opening hours and the areas you serve in ${city}.`;
}
