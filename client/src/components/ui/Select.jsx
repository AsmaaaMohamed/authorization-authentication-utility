import { useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import { C } from "../../constants/theme";
import Label from "./Label";

export default function Select({
  label,
  required,
  icon: Icon,
  options,
  value,
  onChange,
}) {
  console.log("Select component options:", options); // Log the options to verify they are being passed correctly
  const [open, setOpen] = useState(false);
  const selected =
    options.find((option) => option.value === value) || options[0];
  return (
    <div
      style={{
        marginBottom: 16,
        position: "relative",
      }}
    >
      <Label required={required}>{label}</Label>
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          background: C.panel2,
          border: `1px solid ${C.border}`,
          borderRadius: 8,
          padding: "10px 12px",
          cursor: "pointer",
        }}
      >
        {Icon && <Icon size={14} color={C.textFaint} />}
        <span
          style={{
            flex: 1,
            fontSize: 13.5,
            color: C.text,
          }}
        >
          {selected.label}
        </span>
        <ChevronsUpDown size={13} color={C.textFaint} />
      </div>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: 4,
            background: C.panel2,
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            zIndex: 10,
            overflow: "hidden",
          }}
        >
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                setOpen(false);
                onChange?.(option.value);
              }}
              style={{
                padding: "9px 12px",
                fontSize: 13,
                color: C.text,
                cursor: "pointer",
                background: option.value === selected.value ? C.border : "transparent",
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
