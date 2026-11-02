import Link from "next/link";
import { formatDate } from "@/lib/blog";
import type { Post } from "@/lib/content";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="flex flex-col border-t-2 border-ink pt-4">
      <p className="text-sm font-semibold text-ink-muted">
        {post.category} · <time dateTime={post.date}>{formatDate(post.date)}</time>
      </p>
      <h3 className="mt-2 text-2xl leading-snug font-semibold">
        <Link href={`/blog/${post.slug}`} className="hover:underline">
          {post.title}
        </Link>
      </h3>
      <p className="mt-2 text-ink-muted">{post.description}</p>
      <p className="mt-3 text-sm text-ink-muted">{post.readingMinutes} min read</p>
    </article>
  );
}
