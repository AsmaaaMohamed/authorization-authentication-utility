import { C, TAGS } from "../../constants/theme";

export default function CheckboxRow({ tagKey, checked, onToggle }) {
  const tag = TAGS[tagKey];

  return (
    <div
      onClick={onToggle}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 9,
        padding: "8px 10px",
        borderRadius: 7,
        border: `1px solid ${checked ? tag.color + "55" : C.border}`,
        background: checked ? tag.color + "14" : C.panel2,
        cursor: "pointer",
        marginBottom: 7,
      }}
    >
      <div
        style={{
          width: 15,
          height: 15,
          borderRadius: 4,
          border: `1.5px solid ${checked ? tag.color : C.textFaint}`,
          background: checked ? tag.color : "transparent",
          flexShrink: 0,
        }}
      />

      <span
        style={{
          fontSize: 12.5,
          color: C.text,
        }}
      >
        {tag.label}
      </span>
    </div>
  );
}
