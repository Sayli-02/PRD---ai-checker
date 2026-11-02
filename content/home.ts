// All landing-page copy lives here. Rules: .cursor/skills/copy-rules.
// Names inside `problem.example` are made up and labelled as an illustration.
// Icons are lucide names; components/home/icons.ts maps them.

export type IconName = "BarChart3" | "Users" | "Zap" | "MessageSquare" | "Link2" | "Layers" | "MapPin" | "Globe" | "Lock";

export const home = {
  nav: {
    links: [
      { label: "How it works", href: "/#how" },
      { label: "Blog", href: "/blog" },
      { label: "FAQ", href: "/#faq" },
    ],
    cta: "Check My Visibility",
  },

  hero: {
    eyebrow: "Free AI Visibility Check",
    titleLead: "Be the business AI tools",
    titleAccent: "recommend.",
    subtitle:
      "We help businesses get discovered on Google and recommended by AI assistants like ChatGPT, Gemini and Perplexity.",
    subtitleShort: "Do AI tools name your business?",
    points: [
      { icon: "BarChart3", label: "Higher visibility" },
      { icon: "Users", label: "More customers" },
      { icon: "Zap", label: "Done for you" },
    ] as { icon: IconName; label: string }[],
    imageAlt: "",
    form: {
      title: "Free AI Visibility Check",
      intro: "See how often AI tools recommend your business and what you can do to improve.",
      introShort: "See how often AI names your business.",
      url: { label: "Your website URL", placeholder: "Your website URL" },
      category: { label: "Business category", placeholder: "Business category" },
      city: { label: "City", placeholder: "City (e.g. Pune)" },
      submit: "Run Free Check",
      submitting: "Starting your check",
      notes: ["Takes under 60 seconds", "No credit card needed"],
    },
  },

  trust: {
    label: "Analysed across",
    engines: ["ChatGPT", "Gemini", "Perplexity", "Google"],
    countLabel: "AI visibility checks run",
  },

  problem: {
    eyebrow: "The problem",
    title: "AI tools are already recommending your competitors.",
    body: "When people ask for the best options, your business might not even be in the answer.",
    cta: "See an example",
    example: {
      label: "Illustrative example, not a real result",
      question: "Best dental clinics in Pune?",
      engine: "ChatGPT",
      answerIntro: "Here are some top dental clinics in Pune:",
      names: ["SmileCare Dental", "Pune Dental Studio", "WhiteLeaf Dental"],
      yours: "Your business",
      missing: "Not on the list",
    },
  },

  shows: {
    eyebrow: "What the check shows",
    items: [
      { icon: "BarChart3", title: "Mention rate", text: "How often AI tools mention your business." },
      { icon: "Users", title: "Competitors named", text: "Which other businesses are recommended instead." },
      { icon: "Layers", title: "Sources AI trusts", text: "The websites and content they rely on." },
      { icon: "Zap", title: "Quick fixes", text: "Simple, high-impact actions to improve visibility." },
    ] as { icon: IconName; title: string; text: string }[],
  },

  how: {
    eyebrow: "How we work",
    title: "We do the work. You run your business.",
    steps: [
      { title: "Audit", text: "We study how Google and AI tools see your business today." },
      { title: "Optimise", text: "Our team improves your pages, listings and content. You do no SEO yourself." },
      { title: "Track monthly", text: "Every month you get a clear report on what changed and what is next." },
    ],
  },

  compare: {
    eyebrow: "In plain words",
    title: "Google search and AI answers are different games",
    columns: ["SEO", "AEO"],
    subtitles: ["Get ranked on Google", "Get named in AI answers"],
    rows: [
      { label: "Where it works", values: ["Google search results", "ChatGPT, Gemini and Perplexity answers"] },
      { label: "What the customer sees", values: ["A list of links to choose from", "One short answer naming a few businesses"] },
      { label: "What we work on", values: ["Your pages, keywords, speed and links", "Clear facts, trusted sources and pages AI can quote"] },
    ],
    note: "Many customers still search on Google. More now ask AI first. We handle both.",
  },

  report: {
    eyebrow: "Sample report",
    title: "See what the full report holds",
    body: "After your free check, our team sends the full report to you. This is a preview of its layout. The numbers here are placeholders.",
    lock: "Your full report is sent by our team",
    rows: ["Mention rate by AI tool", "Competitors named, in order", "Sources AI quotes in your category", "Your first three fixes"],
  },

  testimonials: {
    eyebrow: "Clients",
    title: "What clients say",
    // Add real, approved testimonials only. The section stays hidden unless brand.features.showTestimonials is true.
    items: [] as { quote: string; name: string; role: string }[],
  },

  blog: { eyebrow: "From the blog", title: "Latest from the blog", all: "All posts" },

  faq: {
    eyebrow: "FAQ",
    title: "Questions, answered",
    items: [
      {
        q: "What is AEO?",
        a: "AEO means Answer Engine Optimisation. It is the work of getting your business named and cited when people ask AI tools like ChatGPT, Gemini or Perplexity for a recommendation.",
      },
      {
        q: "How long do results take?",
        a: "It depends on your market and where you start. Changes to AI answers can take weeks to months, and nobody can promise a result. We track progress with you every month.",
      },
      {
        q: "Is the AI Visibility Check really free?",
        a: "Yes. The check is free. You share your contact details to see your score, and our team sends you the full report.",
      },
      {
        q: "What do you need from me?",
        a: "Very little. We need basic details about your business and access to a few pages or listings. Our team does the work.",
      },
      {
        q: "Which AI tools does the check use?",
        a: "ChatGPT, Gemini and Perplexity. We ask each one five questions a customer in your city might ask. That gives 15 answers. We then see how many of them name your business and who they name instead.",
      },
      {
        q: "Will AI answers always be the same?",
        a: "No. AI answers change from one run to the next. Your check is a snapshot of today, not a ranking.",
      },
      {
        q: "Is my data safe?",
        a: "We collect only your name, mobile number and email, and we ask for your consent first. We use them only to send your report and to talk to you about it. Read our privacy policy for details.",
      },
    ],
  },

  finalCta: {
    title: "Find out where you stand today.",
    body: "It takes under 60 seconds and costs nothing.",
  },

  footer: {
    whatsappLabel: "Chat on WhatsApp",
    whatsappMessage: "Hi, I would like to know more about the AI Visibility Check.",
    legal: [
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
} as const;
