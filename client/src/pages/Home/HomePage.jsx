import { ArrowRight, Bell, BriefcaseBusiness, FolderKanban, LayoutGrid, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import { C, FONT } from "../../constants/theme";

const featureCards = [
  {
    icon: BriefcaseBusiness,
    title: "Workspaces",
    text: "Create and manage separate collaboration spaces for teams, clients, and initiatives.",
  },
  {
    icon: FolderKanban,
    title: "Projects",
    text: "Organize planning, delivery, and execution under one structured project view.",
  },
  {
    icon: LayoutGrid,
    title: "Boards",
    text: "Track progress across stages, sprint lanes, and high-priority delivery goals.",
  },
  {
    icon: Users,
    title: "Members",
    text: "Invite teammates, assign roles, and keep ownership visible across the workspace.",
  },
  {
    icon: Bell,
    title: "Notifications",
    text: "Stay updated with mentions, task changes, approvals, and team activity.",
  },
  {
    icon: ShieldCheck,
    title: "Settings",
    text: "Control workspace configuration, permissions, and operational details from one place.",
  },
];

const statCards = [
  { label: "Workspaces", value: "3+" },
  { label: "Projects", value: "12" },
  { label: "Boards", value: "24" },
  { label: "Members", value: "40" },
];

function HomePage() {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: FONT }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px 60px" }}>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            padding: "14px 18px",
            borderRadius: 18,
            border: `1px solid ${C.border}`,
            background: "rgba(19,24,33,0.45)",
            backdropFilter: "blur(10px)",
            marginBottom: 28,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 10,
                background: C.accent,
                color: C.accentText,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
              }}
            >
              T
            </div>
            <div style={{ fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontSize: 12, color: C.text }}>
              TeamForge
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link to="/login" style={{ textDecoration: "none", color: C.textMuted, fontWeight: 600 }}>Login</Link>
            <Link to="/signup" style={{ textDecoration: "none" }}>
              <Button>Get started</Button>
            </Link>
          </div>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 26,
            alignItems: "center",
            padding: "28px 8px 18px",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                border: `1px solid ${C.border}`,
                borderRadius: 999,
                background: C.panel,
                padding: "7px 12px",
                color: C.accent,
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 18,
              }}
            >
              <Sparkles size={14} />
              Built for modern teams
            </div>

            <h1 style={{ fontSize: "clamp(2.6rem, 5vw, 5rem)", lineHeight: 1.02, margin: 0, letterSpacing: "-0.06em" }}>
              Manage work without the noise.
            </h1>

            <p style={{ fontSize: 18, lineHeight: 1.75, color: C.textMuted, maxWidth: 620, margin: "18px 0 24px" }}>
              TeamForge brings workspaces, projects, boards, people, and updates into one streamlined system so your team can plan, build, and ship with clarity.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <Link to="/signup" style={{ textDecoration: "none" }}>
                <Button icon={ArrowRight}>Start free</Button>
              </Link>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Button variant="secondary">View demo</Button>
              </Link>
            </div>
          </div>

          <div
            style={{
              background: "linear-gradient(135deg, rgba(79,70,229,0.12), rgba(79,70,229,0.03))",
              border: `1px solid ${C.border}`,
              borderRadius: 24,
              padding: 20,
              boxShadow: `0 18px 42px ${C.shadow}`,
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }}>
              {statCards.map((item) => (
                <div key={item.label} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 16, padding: "18px 16px" }}>
                  <div style={{ fontSize: 12, color: C.textFaint, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>{item.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: C.text }}>{item.value}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 18, padding: 18, borderRadius: 18, background: C.panel, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 12, color: C.textFaint, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Live workflow</div>
              <div style={{ display: "grid", gap: 10 }}>
                {[
                  { label: "Product backlog", value: "11 tasks" },
                  { label: "In review", value: "4 tasks" },
                  { label: "Ready to ship", value: "7 tasks" },
                ].map((row) => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13.5, color: C.textMuted }}>
                    <span>{row.label}</span>
                    <span style={{ color: C.text, fontWeight: 600 }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section style={{ paddingTop: 26 }}>
          <div style={{ fontSize: 12, color: C.textFaint, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 18 }}>Everything your team needs</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {featureCards.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                style={{
                  background: C.panel,
                  border: `1px solid ${C.border}`,
                  borderRadius: 18,
                  padding: 18,
                  minHeight: 185,
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(79,70,229,0.08)",
                    color: C.accent,
                    marginBottom: 14,
                  }}
                >
                  <Icon size={18} />
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13.5, lineHeight: 1.7, color: C.textMuted }}>{text}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
