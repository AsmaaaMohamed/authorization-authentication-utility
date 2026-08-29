import { UploadCloud } from "lucide-react";
import Label from "./Label";
import { C } from "../../constants/theme";

function FileDrop({ label, hint }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <Label>{label}</Label>
      <div style={{ border: `1.5px dashed ${C.border}`, borderRadius: 9, padding: "18px 14px", textAlign: "center", cursor: "pointer" }}>
        <UploadCloud size={18} color={C.textFaint} style={{ marginBottom: 6 }} />
        <div style={{ fontSize: 12.5, color: C.textMuted }}>Click or drag file to upload</div>
        <div style={{ fontSize: 11, color: C.textFaint, marginTop: 2 }}>{hint}</div>
      </div>
    </div>
  );
}

export default FileDrop;