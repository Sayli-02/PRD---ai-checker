import type { EngineName } from "../../content/check.ts";

export interface EngineResult {
  engine: EngineName;
  question: string;
  answerText: string;
  citations: string[]; // URLs if the engine provides them
  latencyMs: number;
  status: "ok" | "timeout" | "error";
}

/** One engine's raw call: prompt in, answer text and citations out. Throws on any failure. */
export type EngineClient = (prompt: string, signal: AbortSignal) => Promise<{ text: string; citations: string[] }>;

export async function postJson(url: string, headers: Record<string, string>, body: unknown, signal: AbortSignal) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
