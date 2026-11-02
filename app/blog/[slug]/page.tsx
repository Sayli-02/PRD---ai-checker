import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { CheckCta } from "@/components/blog/check-cta";
import { PostCard } from "@/components/blog/post-card";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { brand } from "@/config/brand";
import { formatDate, headings, related, slugify } from "@/lib/blog";
import { getPost, getPosts } from "@/lib/blog";

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.updated,
      authors: [post.author],
      tags: post.tags,
    },
  };
}

const text = (node: React.ReactNode): string =>
  typeof node === "string" ? node : Array.isArray(node) ? node.map(text).join("") : "";

const components = {
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 id={slugify(text(children))} className="mt-10 mb-3 scroll-mt-20 text-3xl font-bold sm:text-4xl">
      {children}
    </h2>
  ),
  p: (props: React.ComponentProps<"p">) => <p className="my-4 text-lg leading-relaxed" {...props} />,
  ul: (props: React.ComponentProps<"ul">) => <ul className="my-4 list-disc space-y-1.5 pl-6 text-lg" {...props} />,
  ol: (props: React.ComponentProps<"ol">) => <ol className="my-4 list-decimal space-y-1.5 pl-6 text-lg" {...props} />,
  a: ({ href = "", ...props }: React.ComponentProps<"a">) =>
    href.startsWith("/") ? (
      <Link href={href} className="font-semibold underline" {...props} />
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer" className="font-semibold underline" {...props} />
    ),
  table: (props: React.ComponentProps<"table">) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-left" {...props} />
    </div>
  ),
  th: (props: React.ComponentProps<"th">) => <th className="border-b-2 border-on-cream px-3 py-2 font-semibold" {...props} />,
  td: (props: React.ComponentProps<"td">) => <td className="border-b border-line-cream px-3 py-2" {...props} />,
};

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const toc = headings(post.content);
  const url = `${brand.url}/blog/${post.slug}`;

  // The mid-post CTA goes between sections, at the halfway point.
  const sections = post.content.split(/\n(?=## )/);
  const mid = Math.ceil(sections.length / 2);
  const firstHalf = sections.slice(0, mid).join("\n");
  const secondHalf = sections.slice(mid).join("\n");
  const mdx = (source: string) => (
    <MDXRemote source={source} components={components} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
  );

  const more = related(await getPosts(), post);

  return (
    <PageShell>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              headline: post.title,
              description: post.description,
              datePublished: post.date,
              dateModified: post.updated,
              author: { "@type": "Person", name: post.author },
              publisher: { "@type": "Organization", name: brand.name, url: brand.url },
              mainEntityOfPage: url,
              image: post.coverImage ? `${brand.url}${post.coverImage}` : `${url}/opengraph-image`,
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: brand.url },
                { "@type": "ListItem", position: 2, name: "Blog", item: `${brand.url}/blog` },
                { "@type": "ListItem", position: 3, name: post.title, item: url },
              ],
            },
            ...(post.faq.length
              ? [
                  {
                    "@type": "FAQPage",
                    mainEntity: post.faq.map((f) => ({
                      "@type": "Question",
                      name: f.question,
                      acceptedAnswer: { "@type": "Answer", text: f.answer },
                    })),
                  },
                ]
              : []),
          ],
        }}
      />

      <article className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 md:py-14">
        <nav aria-label="Breadcrumb" className="text-sm text-tone-muted">
          <ol className="flex flex-wrap gap-1.5">
            <li>
              <Link href="/" className="underline">
                Home
              </Link>{" "}
              /
            </li>
            <li>
              <Link href="/blog" className="underline">
                Blog
              </Link>{" "}
              /
            </li>
            <li aria-current="page">{post.category}</li>
          </ol>
        </nav>

        <h1 className="mt-4 text-4xl leading-tight font-bold sm:text-6xl">{post.title}</h1>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-line-cream py-3 text-sm">
          <span className="inline-flex items-center gap-2 font-semibold">
            {post.authorPhoto ? (
              <Image src={post.authorPhoto} alt="" width={32} height={32} className="size-8 rounded-full object-cover" />
            ) : (
              <span aria-hidden className="grid size-8 place-items-center rounded-full bg-dark text-xs text-on-dark">
                {post.author
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)}
              </span>
            )}
            {post.author}
          </span>
          <span className="text-tone-muted">
            Published <time dateTime={post.date}>{formatDate(post.date)}</time>
          </span>
          {post.updated !== post.date && (
            <span className="text-tone-muted">
              Updated <time dateTime={post.updated}>{formatDate(post.updated)}</time>
            </span>
          )}
          <span className="text-tone-muted">{post.readingMinutes} min read</span>
        </div>

        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt=""
            width={1200}
            height={630}
            priority
            sizes="(min-width: 768px) 768px, 100vw"
            className="mt-6 h-auto w-full rounded-lg"
          />
        )}

        {toc.length > 2 && (
          <nav aria-labelledby="toc-title" className="mt-8 rounded-card bg-surface-cream p-5">
            <p id="toc-title" className="font-serif text-xl">
              In this post
            </p>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              {toc.map((h) => (
                <li key={h.id}>
                  <a href={`#${h.id}`} className="underline">
                    {h.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="mt-6">
          {mdx(firstHalf)}
          {secondHalf && <CheckCta location="post_mid" />}
          {secondHalf && mdx(secondHalf)}
        </div>

        {post.faq.length > 0 && (
          <section aria-labelledby="faq-title" className="mt-10">
            <h2 id="faq-title" className="text-3xl font-bold sm:text-4xl">
              Frequently asked questions
            </h2>
            <dl className="mt-4 divide-y divide-line-cream border-y border-line-cream">
              {post.faq.map((f) => (
                <div key={f.question} className="py-4">
                  <dt className="text-xl font-semibold">{f.question}</dt>
                  <dd className="mt-1 text-lg text-tone-muted">{f.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <CheckCta location="post_end" />
      </article>

      {more.length > 0 && (
        <section aria-labelledby="related-title" className="bg-cream">
          <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
            <h2 id="related-title" className="text-3xl font-bold sm:text-4xl">
              Related posts
            </h2>
            <div className="mt-6 grid gap-8 md:grid-cols-3">
              {more.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </PageShell>
  );
}
