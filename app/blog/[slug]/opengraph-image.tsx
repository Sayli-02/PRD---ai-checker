import { ImageResponse } from "next/og";
import { brand } from "@/config/brand";
import { Mark } from "@/components/mark";
import { getPost, getPosts } from "@/lib/blog";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Blog post cover";

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export default async function PostOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPost((await params).slug);
  const c = brand.colors;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: c.dark,
          color: c["on-dark"],
          padding: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 40, fontWeight: 700 }}>
          <Mark size={56} />
          <span>{brand.name}</span>
        </div>
        <div style={{ display: "flex", fontSize: 72, fontWeight: 700, lineHeight: 1.08, maxWidth: 1040 }}>
          {post?.title ?? brand.name}
        </div>
        <div style={{ display: "flex", fontSize: 32, color: c["muted-on-dark"] }}>
          {post?.category ?? ""}
        </div>
      </div>
    ),
    size,
  );
}
