// All landing-page copy lives here. Rules: .cursor/skills/copy-rules.
// Names inside `problem.example` are made up and shown as an illustration.

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

export const site = {
  nav: {
    links: [
      { label: "How it works", href: "#how" },
      { label: "Blog", href: "/blog" },
      { label: "FAQ", href: "#faq" },
    ],
    cta: "Check my visibility",
  },

  hero: {
    title: "Customers now ask AI. Make sure it names you.",
    subtitle:
      "See if ChatGPT, Gemini and Perplexity recommend your business. If they don't, our team fixes that for you.",
    points: ["Found on Google", "Named by AI", "Done for you"],
    form: {
      title: "Free AI Visibility Check",
      intro: "See how often AI tools name your business.",
      url: { label: "Your website", placeholder: "yourbusiness.com" },
      category: { label: "Business category", placeholder: "Choose a category" },
      city: { label: "City", placeholder: "Pune" },
      submit: "Run free check",
      submitting: "Starting your check",
      notes: ["Takes under 60 seconds", "No card needed"],
    },
  },

  trust: {
    label: "The check asks",
    engines: ["ChatGPT", "Gemini", "Perplexity"],
    note: "Results are a snapshot of today's answers.",
  },

  problem: {
    title: "AI may already be sending your customers to someone else.",
    body: "When people ask for the best option in your city, AI gives a short list. If you are not on it, they never see you.",
    example: {
      label: "Illustrative example, not a real result",
      question: "Best dental clinics in Pune?",
      engine: "ChatGPT",
      answerIntro: "Here are some well-reviewed options:",
      names: ["Orchid Dental Care", "Smilecraft Clinic", "Nova Dental Studio"],
      yours: "Your business",
      missing: "Not on the list",
    },
  },

  shows: {
    title: "What your free check shows",
    items: [
      { title: "Mention rate", text: "How many of 15 AI answers name your business." },
      { title: "Competitors named", text: "Who AI recommends when it skips you." },
      { title: "Sources AI trusts", text: "The websites AI quotes in your category." },
      { title: "Quick fixes", text: "One simple first step you can take." },
    ],
  },

  how: {
    title: "We do the work. You run your business.",
    steps: [
      {
        title: "Audit",
        text: "We study how Google and AI tools see your business today.",
      },
      {
        title: "Optimise",
        text: "Our team improves your pages, listings and content. You do no SEO yourself.",
      },
      {
        title: "Track",
        text: "Every month you get a clear report on what changed and what is next.",
      },
    ],
  },

  compare: {
    title: "SEO and AEO, in plain words",
    columns: ["SEO", "AEO"],
    subtitles: ["Get ranked on Google", "Get named in AI answers"],
    rows: [
      {
        label: "Where it works",
        values: ["Google search results", "ChatGPT, Gemini and Perplexity answers"],
      },
      {
        label: "What the customer sees",
        values: ["A list of links to choose from", "One short answer naming a few businesses"],
      },
      {
        label: "What we work on",
        values: [
          "Your pages, keywords, speed and links",
          "Clear facts, trusted sources and pages AI can quote",
        ],
      },
    ],
    note: "Many customers still search on Google. More now ask AI first. We handle both.",
  },

  report: {
    title: "See what the full report holds",
    body: "After your free check, our team sends the full report to you. This is a preview of its layout.",
    lock: "Your full report is sent by our team",
  },

  testimonials: {
    title: "What clients say",
    // Add real, approved testimonials only. The section stays hidden while this is empty.
    items: [] as { quote: string; name: string; role: string }[],
  },

  blog: { title: "Latest from the blog", all: "All posts" },

  faq: {
    title: "Questions, answered",
    items: [
      {
        q: "What is AEO?",
        a: "AEO means Answer Engine Optimisation. It is the work of getting your business named and cited when people ask AI tools like ChatGPT, Gemini or Perplexity for a recommendation.",
      },
      {
        q: "How is AEO different from SEO?",
        a: "SEO helps you rank in Google's list of links. AEO helps you appear inside the short answer that an AI tool gives. Most businesses need both.",
      },
      {
        q: "Is the AI Visibility Check really free?",
        a: "Yes. The check is free. You share your contact details to see your score, and our team sends you the full report.",
      },
      {
        q: "How does the check work?",
        a: "We ask ChatGPT, Gemini and Perplexity five questions a customer in your city might ask. That gives 15 answers. We then see how many of them name your business and who they name instead.",
      },
      {
        q: "How long do results take?",
        a: "It depends on your market and where you start. Changes to AI answers can take weeks to months, and nobody can promise a result. We track progress with you every month.",
      },
      {
        q: "What do you need from me?",
        a: "Very little. We need basic details about your business and access to a few pages or listings. Our team does the work.",
      },
      {
        q: "Will AI answers always be the same?",
        a: "No. AI answers change from one run to the next. Your check is a snapshot of today, not a ranking.",
      },
      {
        q: "How do you use my contact details?",
        a: "We use them only to send your report and to talk to you about it. With your consent we may call or message you on WhatsApp. Read our privacy policy for details.",
      },
    ],
  },

  finalCta: {
    title: "Find out where you stand today.",
    body: "It takes under 60 seconds and costs nothing.",
  },

  footer: {
    tagline: "SEO and AEO for businesses that want to be found.",
    whatsappLabel: "Chat on WhatsApp",
    whatsappMessage: "Hi, I would like to know more about the AI Visibility Check.",
    legal: [
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
} as const;
