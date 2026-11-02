// Five buyer-style questions per check. Edit here to change what we ask the engines.
const templates = [
  (c: string, city: string) => `best ${c} in ${city}`,
  (c: string, city: string) => `top rated ${c} near me in ${city}`,
  (c: string, city: string) => `which ${c} in ${city} should I choose`,
  (c: string, city: string) => `most trusted ${c} in ${city} with good reviews`,
  (c: string, city: string) => `recommend a good ${c} in ${city}`,
];

export const buildQuestions = (category: string, city: string) =>
  templates.map((t) => t(category, city));

// Appended so answers come back as a list we can read positions from.
export const FORMAT_HINT =
  "Answer with a numbered list of up to 5 businesses. Format each line as: **Business name** - one short reason. No introduction.";
