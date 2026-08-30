import { C } from "../../constants/theme";
import { X } from "lucide-react";
export default function Modal({ title, onClose, children, width = 460 }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000000AA",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 60,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width,
          maxWidth: "90vw",
          maxHeight: "85vh",
          overflowY: "auto",
          background: C.panel,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: 22,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 18,
          }}
        >
          <div style={{ fontSize: 15, color: C.text, fontWeight: 600 }}>
            {title}
          </div>
          <X
            size={17}
            color={C.textMuted}
            style={{ cursor: "pointer" }}
            onClick={onClose}
          />
        </div>
        {children}
      </div>
    </div>
  );
}
