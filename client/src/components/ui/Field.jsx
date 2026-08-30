import { C, FONT } from "../../constants/theme";
import Label from "./Label";

export default function Field({ label,name, required, icon: Icon, type = "text", placeholder, value, onChange, right }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <Label required={required}>{label}</Label>
      <div style={{ display: "flex", alignItems: "center", gap: 9, background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px" }}>
        {Icon && <Icon size={14} color={C.textFaint} />}
        <input name={name} required={required} type={type} placeholder={placeholder} value={value} onChange={onChange} style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 13.5, color: C.text, fontFamily: FONT}} />
        {right}
      </div>
    </div>
  );
}