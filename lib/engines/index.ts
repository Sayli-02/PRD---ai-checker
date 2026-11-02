import "server-only";
import { FORMAT_HINT, type EngineName } from "../../content/check.ts";
import { gemini } from "./gemini";
import { openai } from "./openai";
import { perplexity } from "./perplexity";
import type { EngineClient, EngineResult } from "./types";

export type { EngineResult } from "./types";

// Per call. One slow engine must not block the others, so every call has its own clock.
export const CALL_TIMEOUT_MS = 25_000;

const clients: Record<EngineName, EngineClient> = { openai, gemini, perplexity };

/** Asks one engine one question. Never throws: failures come back with status "timeout" or "error". */
export async function askEngine(engine: EngineName, question: string): Promise<EngineResult> {
  const started = Date.now();
  try {
    const { text, citations } = await clients[engine](`${question}\n\n${FORMAT_HINT}`, AbortSignal.timeout(CALL_TIMEOUT_MS));
    if (!text.trim()) throw new Error("empty answer");
    return { engine, question, answerText: text, citations, latencyMs: Date.now() - started, status: "ok" };
  } catch (error) {
    const timedOut = error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");
    console.error(`[engine:${engine}]`, error instanceof Error ? error.message : error);
    return { engine, question, answerText: "", citations: [], latencyMs: Date.now() - started, status: timedOut ? "timeout" : "error" };
  }
}
