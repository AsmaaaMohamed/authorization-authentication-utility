import { C, FONT, MONO } from "../../constants/theme";

export default function AuthShell({ children }) {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, padding: "40px 16px" }}>
      <div style={{ width: 400, maxWidth: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, justifyContent: "center", marginBottom: 28 }}>
          <div style={{ width: 26, height: 26, borderRadius: 6, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 13, fontWeight: 700, color: C.accentText }}>T</div>
          <span style={{ fontFamily: MONO, fontSize: 15, color: C.text, letterSpacing: 0.3 }}>TeamForge</span>
        </div>
        <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 26 }}>{children}</div>
      </div>
    </div>
  );
}