import "server-only";
import { getEnv } from "../env";
import { postJson, type EngineClient } from "./types";

export const perplexity: EngineClient = async (prompt, signal) => {
  const { PERPLEXITY_API_KEY, PERPLEXITY_MODEL } = getEnv();
  if (!PERPLEXITY_API_KEY) throw new Error("PERPLEXITY_API_KEY is not set");
  const data = await postJson(
    "https://api.perplexity.ai/chat/completions",
    { authorization: `Bearer ${PERPLEXITY_API_KEY}` },
    { model: PERPLEXITY_MODEL ?? "sonar", messages: [{ role: "user", content: prompt }] },
    signal,
  );
  return {
    text: data.choices?.[0]?.message?.content ?? "",
    citations: Array.isArray(data.citations) ? data.citations.filter((c: unknown): c is string => typeof c === "string") : [],
  };
};
