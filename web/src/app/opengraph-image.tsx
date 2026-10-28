import { ImageResponse } from "next/og";
import { getPortfolio } from "@/lib/content";
import { initials } from "@/lib/format";

export const alt = "Lateef Yomi Kareem, Senior Backend Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Open Graph card: monogram, name, headline and a few core technologies. */
export default async function OpengraphImage() {
  const { profile } = await getPortfolio();
  const stack = ["Java", "Go", "TypeScript", "Kafka", "Kubernetes", "Terraform"];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #0c0e12 0%, #10302c 100%)",
          color: "#eceef2",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 24,
              background: "linear-gradient(135deg, #5eead4, #10b981)",
              color: "#062521",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 700,
            }}
          >
            {initials(profile.name)}
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#9ea5b2" }}>{profile.location}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -2 }}>{profile.name}</div>
          <div style={{ fontSize: 36, color: "#5eead4", maxWidth: 1000 }}>{profile.headline}</div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {stack.map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                fontSize: 24,
                padding: "8px 18px",
                borderRadius: 12,
                border: "1px solid #262b35",
                background: "#13161c",
                color: "#c9ced8",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
