import { ImageResponse } from "next/og";
import { brand } from "@/config/brand";
import { Mark } from "@/components/mark";
import { home } from "@/content/home";

export const alt = `${brand.name}: get found on Google and named by AI`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 44, fontWeight: 700 }}>
          <Mark size={64} />
          {brand.name}
        </div>
        <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1.05, maxWidth: 980 }}>
          {home.hero.titleLead} {home.hero.titleAccent}
        </div>
        <div style={{ display: "flex", height: 10, width: 220, background: c.accent }} />
      </div>
    ),
    size,
  );
}
