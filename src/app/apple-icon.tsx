import { ImageResponse } from "next/og";

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
          background: "#0C1222",
          borderRadius: 40,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 36,
            width: 0,
            height: 0,
            borderLeft: "42px solid transparent",
            borderRight: "42px solid transparent",
            borderBottom: "34px solid #1D5DA8",
            opacity: 0.22,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 44,
            width: 72,
            height: 4,
            background: "#5B9FD9",
            borderRadius: 2,
            opacity: 0.5,
          }}
        />
        <div
          style={{
            fontSize: 108,
            fontWeight: 800,
            color: "#5B9FD9",
            fontFamily: "Georgia, serif",
            marginTop: 18,
          }}
        >
          K
        </div>
      </div>
    ),
    { ...size },
  );
}