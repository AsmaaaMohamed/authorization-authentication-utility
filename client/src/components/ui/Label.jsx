import { C } from "../../constants/theme";

function Label({ children, required }) {
  return <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 7 }}>{children}{required && <span style={{ color: C.red }}> *</span>}</div>;
}

export default Label;