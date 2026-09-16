import { Outlet } from "react-router-dom";
import { C, FONT } from "../../constants/theme";

export default function AuthLayout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.text,
        fontFamily: FONT,
        display: "grid",
        gridTemplateColumns: "minmax(340px, 1.08fr) minmax(300px, 0.92fr)",
      }}
    >
      <main
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 24px",
          background: "linear-gradient(180deg, rgba(79,70,229,0.03), transparent)",
        }}
      >
        <Outlet />
      </main>

      <aside
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "36px 32px",
          background: "linear-gradient(135deg, rgba(79,70,229,0.18), rgba(15,23,42,0.84))",
          borderLeft: `1px solid ${C.border}`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at top left, rgba(255,255,255,0.16), transparent 42%)",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 12px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(15, 23, 42, 0.15)",
              color: "#edf2ff",
              marginBottom: 26,
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 8,
                background: "#4f46e5",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              T
            </div>
            <span style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase" }}>TeamForge</span>
          </div>

          <div style={{ fontSize: 38, lineHeight: 1.1, color: "#edf2ff", fontWeight: 800, marginBottom: 16 }}>
            Build better work,
            <br />
            together.
          </div>

          <div style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(237,242,255,0.8)", marginBottom: 30 }}>
            Organize projects, keep teams aligned, and move work forward with a focused workspace experience.
          </div>

          <div style={{ display: "grid", gap: 14 }}>
            {[
              { title: "Sprint clarity", text: "See progress at a glance across boards and tasks." },
              { title: "Shared context", text: "Keep comments, updates, and decisions in one place." },
              { title: "Faster delivery", text: "Move from planning to execution without losing momentum." },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  background: "rgba(13, 20, 31, 0.28)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 14,
                  padding: "14px 14px",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 9,
                    background: "rgba(79, 70, 229, 0.2)",
                    border: "1px solid rgba(79, 70, 229, 0.38)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#dfe7ff",
                    fontWeight: 700,
                  }}
                >
                  ✓
                </div>
                <div>
                  <div style={{ fontSize: 14, color: "#ffffff", fontWeight: 700, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontSize: 12.5, color: "rgba(237,242,255,0.75)", lineHeight: 1.6 }}>{item.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
