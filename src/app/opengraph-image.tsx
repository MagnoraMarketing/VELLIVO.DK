import { ImageResponse } from "next/og";

export const alt = "Vellivo – mere velvære i hverdagen";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 96,
          background: "linear-gradient(135deg, #faf7f2 0%, #ede5d8 60%, #dfe6dc 100%)",
          color: "#1e2320",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 88, height: 88, borderRadius: 24, background: "#2f4a3f", display: "flex", alignItems: "center", justifyContent: "center", color: "#faf7f2", fontSize: 56, fontWeight: 700 }}>
            V
          </div>
          <div style={{ fontSize: 72, fontWeight: 600, letterSpacing: -2 }}>vellivo</div>
        </div>
        <div style={{ marginTop: 40, fontSize: 52, color: "#2f4a3f" }}>Mere velvære i hverdagen</div>
        <div style={{ marginTop: 16, fontSize: 30, color: "#59625c" }}>Massageapparater til hjemmet · Priser i DKK inkl. moms</div>
      </div>
    ),
    size,
  );
}
