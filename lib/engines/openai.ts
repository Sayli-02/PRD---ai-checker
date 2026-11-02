import "server-only";
import { getEnv } from "../env";
import { postJson, type EngineClient } from "./types";

export const openai: EngineClient = async (prompt, signal) => {
  const { OPENAI_API_KEY, OPENAI_MODEL } = getEnv();
  if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not set");
  const data = await postJson(
    "https://api.openai.com/v1/chat/completions",
    { authorization: `Bearer ${OPENAI_API_KEY}` },
    { model: OPENAI_MODEL ?? "gpt-4o-mini", messages: [{ role: "user", content: prompt }] },
    signal,
  );
  return { text: data.choices?.[0]?.message?.content ?? "", citations: [] };
};
