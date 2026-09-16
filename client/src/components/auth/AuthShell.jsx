import { C, FONT, MONO } from "../../constants/theme";

export default function AuthShell({ children }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 440,
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          background: C.panel,
          border: `1px solid ${C.border}`,
          borderRadius: 20,
          padding: "28px 24px",
          boxShadow: `0 18px 45px ${C.shadow}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 10,
              background: C.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: MONO,
              fontSize: 13,
              fontWeight: 700,
              color: C.accentText,
            }}
          >
            T
          </div>
          <span style={{ fontFamily: MONO, fontSize: 15, color: C.text, letterSpacing: 0.3 }}>TeamForge</span>
        </div>

        {children}
      </div>
    </div>
  );
}