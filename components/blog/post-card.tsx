import Link from "next/link";
import { Pill } from "@/components/ui/pill";
import { formatDate, type Post } from "@/lib/blog";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="group relative flex flex-col rounded-card border border-tone-line bg-tone-surface p-5 transition-shadow hover:shadow-[0_16px_32px_-20px_rgb(20_17_15/0.4)] motion-reduce:transition-none">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-tone-muted">
        <Pill className="px-2.5 py-0.5 text-xs">{post.category}</Pill>
        <time dateTime={post.date}>{formatDate(post.date)}</time>
      </div>
      <h3 className="mt-3 text-2xl leading-snug">
        <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 group-hover:underline">
          {post.title}
        </Link>
      </h3>
      <p className="mt-2 text-tone-muted">{post.description}</p>
      <p className="mt-auto pt-4 text-sm text-tone-muted">{post.readingMinutes} min read</p>
    </article>
  );
}
