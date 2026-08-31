import { C } from "../constants/theme";

function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "22px 28px", borderBottom: `1px solid ${C.border}` }}>
      <div>
        <div style={{ fontSize: 18, color: C.text, fontWeight: 600, marginBottom: 4 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 13, color: C.textFaint }}>{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}

export default PageHeader;