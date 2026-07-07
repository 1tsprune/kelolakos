import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 8,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 5,
            width: 0,
            height: 0,
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderBottom: "7px solid #5B9FD9",
            opacity: 0.9,
          }}
        />
        <div
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: "#5B9FD9",
            fontFamily: "Georgia, serif",
            marginTop: 4,
          }}
        >
          K
        </div>
      </div>
    ),
    { ...size },
  );
}