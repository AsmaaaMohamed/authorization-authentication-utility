const THEME_TOKENS = {
  light: {
    bg: "#f5f7fb",
    panel: "#ffffff",
    panelAlt: "#eef3ff",
    border: "#dfe5f0",
    borderSoft: "#edf1f7",
    text: "#18212f",
    textMuted: "#4d5b73",
    textFaint: "#7b8797",
    accent: "#4f46e5",
    accentSoft: "#e0e7ff",
    accentText: "#ffffff",
    amber: "#f59e0b",
    red: "#dc2626",
    success: "#16a34a",
    shadow: "rgba(15, 23, 42, 0.08)",
    muted: "#6b7280",
  },
  dark: {
    bg: "#0b0d11",
    panel: "#131821",
    panelAlt: "#1b2230",
    border: "#2a3345",
    borderSoft: "#1d2531",
    text: "#edf2ff",
    textMuted: "#a7b1c4",
    textFaint: "#7f8ca8",
    accent: "#4fe0c4",
    accentSoft: "#163b37",
    accentText: "#08130f",
    amber: "#f5b84d",
    red: "#e8697a",
    success: "#4ade80",
    shadow: "rgba(2, 6, 23, 0.4)",
    muted: "#8890a0",
  },
};

const C = {
  bg: "var(--bg)",
  panel: "var(--panel)",
  panel2: "var(--panel-alt)",
  panelAlt: "var(--panel-alt)",
  border: "var(--border)",
  borderSoft: "var(--border-soft)",
  text: "var(--text)",
  textMuted: "var(--text-muted)",
  textFaint: "var(--text-faint)",
  accent: "var(--accent)",
  accentDim: "var(--accent-soft)",
  accentText: "var(--accent-text)",
  amber: "var(--amber)",
  red: "var(--red)",
  success: "var(--success)",
  muted: "var(--muted)",
  shadow: "var(--shadow)",
};

const FONT = "Inter, -apple-system, sans-serif";
const MONO = "'IBM Plex Mono', monospace";

const TAGS = {
  urgent: { label: "urgent", color: "var(--red)" },
  backend: { label: "backend", color: "var(--accent)" },
  design: { label: "design", color: "var(--amber)" },
};

export { C, FONT, MONO, TAGS, THEME_TOKENS };