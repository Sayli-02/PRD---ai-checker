import "server-only";
import { FORMAT_HINT } from "./questions";

export type EngineName = "openai" | "gemini" | "perplexity";
export type RawAnswer = {
  engine: EngineName;
  question: string;
  text: string | null; // null = this call failed or timed out
  citations: string[];
};

const TIMEOUT_MS = 40_000; // keeps the whole check under 60 s

async function post(url: string, headers: Record<string, string>, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function key(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

// Model names are overridable because providers rename them often.
const engines: Record<
  EngineName,
  (prompt: string) => Promise<{ text: string; citations: string[] }>
> = {
  async openai(prompt) {
    const data = await post(
      "https://api.openai.com/v1/chat/completions",
      { authorization: `Bearer ${key("OPENAI_API_KEY")}` },
      {
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      },
    );
    return { text: data.choices?.[0]?.message?.content ?? "", citations: [] };
  },

  async gemini(prompt) {
    const model = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";
    const data = await post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      { "x-goog-api-key": key("GEMINI_API_KEY") },
      { contents: [{ parts: [{ text: prompt }] }] },
    );
    const parts: { text?: string }[] = data.candidates?.[0]?.content?.parts ?? [];
    return { text: parts.map((p) => p.text ?? "").join(""), citations: [] };
  },

  async perplexity(prompt) {
    const data = await post(
      "https://api.perplexity.ai/chat/completions",
      { authorization: `Bearer ${key("PERPLEXITY_API_KEY")}` },
      {
        model: process.env.PERPLEXITY_MODEL ?? "sonar",
        messages: [{ role: "user", content: prompt }],
      },
    );
    return {
      text: data.choices?.[0]?.message?.content ?? "",
      citations: Array.isArray(data.citations) ? data.citations : [],
    };
  },
};

/** Asks every question to every engine in parallel. Never throws; failed calls come back with text: null. */
export async function askAll(
  questions: string[],
  onAnswer: (answer: RawAnswer) => void,
): Promise<RawAnswer[]> {
  const jobs = questions.flatMap((question) =>
    (Object.keys(engines) as EngineName[]).map(async (engine) => {
      let answer: RawAnswer;
      try {
        const { text, citations } = await engines[engine](`${question}\n\n${FORMAT_HINT}`);
        answer = { engine, question, text: text || null, citations };
      } catch (error) {
        console.error(`[check] ${engine} failed:`, error instanceof Error ? error.message : error);
        answer = { engine, question, text: null, citations: [] };
      }
      onAnswer(answer);
      return answer;
    }),
  );
  return Promise.all(jobs);
}
