import "server-only";
import { getEnv } from "../env";
import { postJson, type EngineClient } from "./types";

export const gemini: EngineClient = async (prompt, signal) => {
  const { GEMINI_API_KEY, GEMINI_MODEL } = getEnv();
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set");
  const data = await postJson(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL ?? "gemini-2.0-flash"}:generateContent`,
    { "x-goog-api-key": GEMINI_API_KEY },
    { contents: [{ parts: [{ text: prompt }] }] },
    signal,
  );
  const parts: { text?: string }[] = data.candidates?.[0]?.content?.parts ?? [];
  return { text: parts.map((p) => p.text ?? "").join(""), citations: [] };
};
