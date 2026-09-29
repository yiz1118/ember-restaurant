import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "EMBER, a fictional live-fire dining concept";

export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ display: "flex", width: "100%", height: "100%", padding: 70, background: "#25231f", color: "#f2ede4", flexDirection: "column", justifyContent: "space-between" }}><div style={{ display: "flex", color: "#d8c2ae", fontSize: 17, letterSpacing: 6 }}>CONCEPT PROJECT · LIVE-FIRE DINING</div><div style={{ display: "flex", flexDirection: "column" }}><div style={{ display: "flex", fontFamily: "Georgia", fontSize: 190, letterSpacing: -14, lineHeight: 1 }}>EMBER<span style={{ color: "#bd8060" }}>.</span></div><div style={{ display: "flex", color: "#d8c2ae", fontSize: 29 }}>Seasonal ingredients. Open fire. Unhurried evenings.</div></div><div style={{ display: "flex", width: "100%", height: 2, background: "#79533d" }} /></div>, size);
}
