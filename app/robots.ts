import type { MetadataRoute } from "next";
import { brand } from "@/config/brand";

// "*" covers AI crawlers (GPTBot, PerplexityBot, Google-Extended, ClaudeBot...): they are allowed on purpose.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/check"] },
    sitemap: `${brand.url}/sitemap.xml`,
  };
}
