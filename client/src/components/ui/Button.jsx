import { C, FONT } from "../../constants/theme";

export default function Button({
  children,
  variant = "primary",
  onClick,
  full,
  icon: Icon,
  type = "button",
}) {
  const styles = {
    primary: { background: C.accent, color: C.accentText, border: "none" },
    secondary: {
      background: C.panel2,
      color: C.text,
      border: `1px solid ${C.border}`,
    },
    danger: {
      background: "transparent",
      color: C.red,
      border: `1px solid ${C.red}44`,
    },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        ...styles[variant],
        width: full ? "100%" : "auto",
        padding: "10px 16px",
        borderRadius: 8,
        fontSize: 13.5,
        fontWeight: 600,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        fontFamily: FONT,
      }}
    >
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
}
