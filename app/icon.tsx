import { ImageResponse } from "next/og";
import { brand } from "@/config/brand";
import { Mark } from "@/components/mark";

// Favicon (32) and the PNG masters (512, 1024) from the same mark.
const sizes = [32, 512, 1024];

export function generateImageMetadata() {
  return sizes.map((s) => ({ id: String(s), size: { width: s, height: s }, contentType: "image/png" }));
}

export default async function Icon({ id }: { id: Promise<string | number> }) {
  const size = Number(await id);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: brand.colors.board,
          color: brand.colors["on-board"],
        }}
      >
        <Mark size={Math.round(size * 0.72)} />
      </div>
    ),
    { width: size, height: size },
  );
}
