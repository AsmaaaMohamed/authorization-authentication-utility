import { C, MONO } from "../../constants/theme";

export default function Avatar({ initials, size = 24 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 6,
        background: C.panel2,
        border: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.4,
        fontFamily: MONO,
        color: C.textMuted,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}
