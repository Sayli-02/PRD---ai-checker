import { ImageResponse } from "next/og";
import { brand } from "@/config/brand";
import { Mark } from "@/components/mark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
        <Mark size={130} />
      </div>
    ),
    size,
  );
}
