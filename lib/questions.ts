// Builds the five buyer-style questions for a check. The wording lives in content/check.ts.
import { questionTemplates } from "../content/check.ts";

export const buildQuestions = (category: string, city: string): string[] =>
  questionTemplates.map((t) => t.replace("{category}", category).replace("{city}", city));
