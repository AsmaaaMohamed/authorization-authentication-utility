import { UploadCloud } from "lucide-react";
import Label from "./Label";
import { C } from "../../constants/theme";
import { useRef } from "react";

function FileDrop({ label, hint, onChange,name,file }) {
  const inputRef = useRef(null);
  return (
    <div style={{ marginBottom: 16 }}>
      <Label>{label}</Label>
      <div onClick={() => inputRef.current.click()} style={{ border: `1.5px dashed ${C.border}`, borderRadius: 9, padding: "18px 14px", textAlign: "center", cursor: "pointer" , display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexDirection: "column", minHeight: 80 }}>
        {file ? (
          <img
            src={URL.createObjectURL(file)}
            alt="Workspace icon preview"
            style={{
              width: 60,
              height: 60,
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
        ) : (
          <>
            <UploadCloud size={18} color={C.textFaint} />

            <div
              style={{
                fontSize: 12.5,
                color: C.textMuted,
              }}
            >
              Click or drag file to upload
            </div>

            <div
              style={{
                fontSize: 11,
                color: C.textFaint,
                marginTop: 2,
              }}
            >
              {hint}
            </div>
          </>
        )}
      </div>
      <input
          ref={inputRef}
          type="file"
          name={name}
          accept="image/*"
          onChange={onChange}
          style={{ display: "none" }}
        />
    </div>
  );
}

export default FileDrop;