import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { cacheLife } from "next/cache";
import { z } from "zod";

// The ONLY module that knows posts are MDX files. To move to a headless CMS (version 2),
// reimplement getPosts() and getPost() and keep their return type.

const DIR = path.join(process.cwd(), "content", "blog");
export const POSTS_PER_PAGE = 9;

// gray-matter turns bare YYYY-MM-DD into a Date; accept both.
const day = z
  .union([z.string(), z.date()])
  .transform((d) => (d instanceof Date ? d.toISOString().slice(0, 10) : d))
  .pipe(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "use YYYY-MM-DD"));

// A bad post fails the build with the file name and the reason.
const frontmatter = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  description: z.string().min(1).max(160, "description must be under 160 characters"),
  date: day,
  updated: day,
  author: z.string().min(1),
  authorPhoto: z.string().optional(), // optional; initials are shown without it
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  coverImage: z.string().optional(), // optional; a typographic cover is drawn without it
  faq: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
});

export type Post = z.infer<typeof frontmatter> & { content: string; readingMinutes: number };

export async function getPosts(): Promise<Post[]> {
  "use cache";
  cacheLife("days");
  const files = (await fs.readdir(DIR).catch(() => [])).filter((f) => f.endsWith(".mdx"));
  const posts = await Promise.all(
    files.map(async (file) => {
      const { data, content } = matter(await fs.readFile(path.join(DIR, file), "utf8"));
      const parsed = frontmatter.safeParse(data);
      if (!parsed.success) {
        const why = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
        throw new Error(`content/blog/${file}: ${why}`);
      }
      const words = content.split(/\s+/).filter(Boolean).length;
      return { ...parsed.data, content, readingMinutes: Math.max(1, Math.ceil(words / 200)) };
    }),
  );
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string): Promise<Post | undefined> {
  "use cache";
  cacheLife("days");
  return (await getPosts()).find((p) => p.slug === slug);
}

export async function getLatestPosts(count: number): Promise<Post[]> {
  return (await getPosts()).slice(0, count);
}

// ---------- helpers (pure) ----------

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

/** H2 headings of an MDX body, for the table of contents. */
export function headings(content: string) {
  return [...content.matchAll(/^##\s+(.+)$/gm)].map((m) => {
    const text = m[1].replace(/[*_`]/g, "").trim();
    return { text, id: slugify(text) };
  });
}

/** Same category first, then newest, never the post itself. */
export function related(posts: Post[], current: Post, count = 3) {
  const others = posts.filter((p) => p.slug !== current.slug);
  const same = others.filter((p) => p.category === current.category);
  return [...same, ...others.filter((p) => p.category !== current.category)].slice(0, count);
}
