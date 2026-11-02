// Everything the check shows or asks that is content, not logic. Plain data, no imports, so tests can load it.

export const categories = [
  { value: "dental clinics", label: "Dental clinics" },
  { value: "hospitals and clinics", label: "Hospitals and clinics" },
  { value: "restaurants", label: "Restaurants and cafes" },
  { value: "coaching centres", label: "Coaching centres" },
  { value: "schools", label: "Schools" },
  { value: "salons and spas", label: "Salons and spas" },
  { value: "gyms and fitness studios", label: "Gyms and fitness studios" },
  { value: "real estate agents", label: "Real estate agents" },
  { value: "interior designers", label: "Interior designers" },
  { value: "lawyers", label: "Lawyers" },
  { value: "chartered accountants", label: "Chartered accountants" },
  { value: "travel agencies", label: "Travel agencies" },
  { value: "wedding planners", label: "Wedding planners" },
  { value: "software companies", label: "Software and IT companies" },
  { value: "local businesses", label: "Other business" },
] as const;

export const ENGINES = ["openai", "gemini", "perplexity"] as const;
export type EngineName = (typeof ENGINES)[number];
export const engineLabels: Record<EngineName, string> = {
  openai: "ChatGPT",
  gemini: "Gemini",
  perplexity: "Perplexity",
};

// Five buyer-style questions per check, asked of each engine: 5 x 3 = 15 answers.
export const questionTemplates = [
  "best {category} in {city}",
  "top rated {category} near {city}",
  "which {category} in {city} should I choose",
  "affordable {category} in {city}",
  "{category} in {city} recommended by locals",
] as const;
export const QUESTIONS_PER_ENGINE = questionTemplates.length;
export const TOTAL_ANSWERS = QUESTIONS_PER_ENGINE * ENGINES.length;

// Appended to every question so answers come back as a list we can read positions from.
export const FORMAT_HINT =
  "Answer with a numbered list of up to 5 businesses. Format each line as: **Business name** - one short reason. No introduction.";

// Highest `min` first. Score is 0-100.
export const bands = [
  { min: 85, label: "Strong" },
  { min: 70, label: "Good" },
  { min: 40, label: "Fair" },
  { min: 0, label: "Low" },
] as const;
export type BandLabel = (typeof bands)[number]["label"];

// One simple, rule-based first step. Chosen by what is missing; never a claim about rankings.
export const quickFixes = {
  noMentions:
    "Add a clear page for each service you offer, with {city} and your address in plain text. AI tools quote pages that answer the question directly.",
  trustedSource:
    "AI tools often quote {source}. Make sure your business has a complete, accurate profile there.",
  faq: "Add short answers to common customer questions on your site, such as your opening hours and the areas you serve in {city}.",
} as const;

export const checkCopy = {
  progress: {
    eyebrow: "AI visibility check",
    title: "Running your check…",
    subtitle: "We're asking ChatGPT, Gemini and Perplexity about your business.",
    processing: "Processing {done} of {total} answers…",
    eta: "~{seconds} seconds left",
    retry: "Retry",
    waiting: "Waiting for your result…",
  },
  contact: {
    title: "Where should we send your report?",
    why: "We use your details only to send your report and to talk to you about it.",
    consent: "I agree to be contacted by call and WhatsApp about my report.",
    name: "Your name",
    mobile: "Mobile number",
    email: "Email",
    sendOtp: "Send code",
    sending: "Sending",
    code: "6-digit code",
    verify: "Verify",
    verifying: "Checking",
    resend: "Resend code",
    resendIn: "Resend in {seconds}s",
  },
  result: {
    eyebrow: "Your results",
    title: "Your AI Visibility Score",
    mentioned: "Your business was mentioned in {n} of {total} AI answers.",
    mentionedZero: "Your business was not mentioned in these AI answers.",
    snapshot: "A snapshot today. AI answers change between runs.",
    locked: "Our team will send your full report.",
    checkAgain: "Check Again",
    statMentioned: "AI answers mentioned you",
    statCompetitors: "Competitors named instead",
    statSources: "Sources cited by AI tools",
    statFix: "Quick fix in this check",
    competitorsTitle: "Top 3 competitors named instead",
    competitorsEmpty: "No other businesses were named in these answers.",
    sourcesEmpty: "The AI tools did not list sources this time.",
    fixTitle: "A quick fix for you",
  },
  notFound: {
    title: "We could not find that check.",
    body: "It may have expired. Start a new one from the home page.",
  },
} as const;

export const errorCopy = {
  turnstile: "We could not confirm you are human. Please try again.",
  rateLimited: "Too many checks from this connection. Please try again in an hour.",
  domainLocked: "This website was already checked in the last 30 days. Our team will send your report.",
  mobileLocked: "This mobile number already ran a check in the last 30 days. Our team will send your report.",
  otpWrong: "That code is not right. Please try again.",
  otpExpired: "This code has expired. Please ask for a new one.",
  otpTooMany: "Too many wrong codes. Please ask for a new one.",
  otpCooldown: "Please wait 30 seconds before asking for another code.",
  engineSlow: "One of the AI tools is slow right now. Please try again.",
  generic: "Something went wrong. Please try again.",
  network: "We could not reach the server. Check your connection and try again.",
} as const;
