import Link from "next/link";
import { PostCard } from "@/components/blog/post-card";
import { site } from "@/content/site";
import { getPosts } from "@/lib/content";

// The three newest posts, pulled from content/blog automatically.
export async function LatestPosts() {
  const posts = (await getPosts()).slice(0, 3);
  if (posts.length === 0) return null;
  return (
    <section className="on-paper bg-paper-deep">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-4xl font-bold sm:text-5xl">{site.blog.title}</h2>
          <Link href="/blog" className="font-semibold underline">
            {site.blog.all}
          </Link>
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
