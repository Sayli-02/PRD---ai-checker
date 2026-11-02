import type { MetadataRoute } from "next";
import { brand } from "@/config/brand";
import { getPosts } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  return [
    { url: brand.url },
    { url: `${brand.url}/blog` },
    ...posts.map((p) => ({ url: `${brand.url}/blog/${p.slug}`, lastModified: p.updated })),
    { url: `${brand.url}/privacy` },
    { url: `${brand.url}/terms` },
  ];
}
