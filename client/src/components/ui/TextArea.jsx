import { C, FONT } from "../../constants/theme";
import Label from "./Label";
export default function TextArea({ label, required, placeholder, rows = 3 }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <Label required={required}>{label}</Label>
      <textarea
        placeholder={placeholder}
        rows={rows}
        style={{
          width: "100%",
          background: C.panel2,
          border: `1px solid ${C.border}`,
          borderRadius: 8,
          padding: "10px 12px",
          fontSize: 13.5,
          color: C.text,
          outline: "none",
          fontFamily: FONT,
          resize: "vertical",
        }}
      />
    </div>
  );
}
