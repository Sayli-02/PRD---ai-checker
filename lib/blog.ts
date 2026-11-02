import type { Post } from "./content";

export const POSTS_PER_PAGE = 9;

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
