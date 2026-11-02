import { brand } from "@/config/brand";
import { getPosts } from "@/lib/content";

// llms.txt: a short, plain summary for AI crawlers. Built from the same config and posts as the site.
export async function GET() {
  const posts = await getPosts();
  const body = `# ${brand.name}

> ${brand.description}

${brand.name} is an agency for SEO (ranking on Google) and AEO, Answer Engine Optimisation (being named and cited inside AI answers). Our team does the work for the client. We offer a free AI Visibility Check that asks ChatGPT, Gemini and Perplexity buyer-style questions about a business and shows how often it is named. Results are a snapshot of the day.

## Key pages

- [Home and free AI Visibility Check](${brand.url}/)
- [Blog](${brand.url}/blog)
- [Privacy policy](${brand.url}/privacy)
- [Terms](${brand.url}/terms)

## Blog posts

${posts.map((p) => `- [${p.title}](${brand.url}/blog/${p.slug}): ${p.description}`).join("\n")}
`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
