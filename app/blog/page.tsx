import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PostCard } from "@/components/blog/post-card";
import { PageShell } from "@/components/page-shell";
import { POSTS_PER_PAGE } from "@/lib/blog";
import { getPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description: "Plain-English guides on getting found on Google and named by AI assistants.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex({ searchParams }: PageProps<"/blog">) {
  return (
    <PageShell>
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 md:py-16">
        <h1 className="text-5xl font-bold sm:text-6xl">Blog</h1>
        <Suspense fallback={<p className="mt-8 text-ink-muted">Loading posts…</p>}>
          <PostList searchParams={searchParams} />
        </Suspense>
      </div>
    </PageShell>
  );
}

async function PostList({ searchParams }: { searchParams: PageProps<"/blog">["searchParams"] }) {
  const sp = await searchParams;
  const category = typeof sp.category === "string" ? sp.category : undefined;
  const all = await getPosts();
  const categories = [...new Set(all.map((p) => p.category))].sort();
  const filtered = category ? all.filter((p) => p.category === category) : all;

  const pages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const page = Math.min(Math.max(1, Number(sp.page) || 1), pages);
  const posts = filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  const href = (p: number, c = category) => {
    const q = new URLSearchParams();
    if (c) q.set("category", c);
    if (p > 1) q.set("page", String(p));
    return q.size ? `/blog?${q}` : "/blog";
  };

  return (
    <>
      <nav aria-label="Categories" className="mt-6 flex flex-wrap gap-2">
        {[undefined, ...categories].map((c) => (
          <Link
            key={c ?? "all"}
            href={href(1, c)}
            aria-current={c === category ? "page" : undefined}
            className={`rounded-md border px-3.5 py-1.5 font-semibold ${
              c === category ? "border-board bg-board text-on-board" : "border-rule bg-slip hover:border-board"
            }`}
          >
            {c ?? "All"}
          </Link>
        ))}
      </nav>

      {posts.length === 0 ? (
        <p className="mt-10 text-lg text-ink-muted">No posts yet.</p>
      ) : (
        <div className="mt-10 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      )}

      {pages > 1 && (
        <nav aria-label="Pages" className="mt-12 flex items-center justify-between border-t border-rule pt-5">
          {page > 1 ? (
            <Link href={href(page - 1)} className="font-semibold underline">
              Newer posts
            </Link>
          ) : (
            <span />
          )}
          <span className="text-ink-muted">
            Page {page} of {pages}
          </span>
          {page < pages ? (
            <Link href={href(page + 1)} className="font-semibold underline">
              Older posts
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </>
  );
}
