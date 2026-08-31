import { Bell, Hash, LayoutGrid, LogOut, SettingsIcon, Users } from "lucide-react";
import Avatar from "./ui/Avatar";
import { C, FONT, MONO } from "../constants/theme";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const nav = [
    { id: "board", icon: LayoutGrid, label: "Board", path: "/board" },
    { id: "members", icon: Users, label: "Members", path: "/members" },
    { id: "notifications", icon: Bell, label: "Notifications", path: "/notifications" },
    { id: "settings", icon: SettingsIcon, label: "Settings", path: "/settings" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%", background: C.bg, fontFamily: FONT }}>
      <div style={{ width: 208, background: C.bg, borderRight: `1px solid ${C.border}`, padding: "18px 12px", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        
        <div onClick={() => navigate("/workspaces")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 6px", marginBottom: 26, cursor: "pointer" }}>
          <div style={{ width: 22, height: 22, borderRadius: 5, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 11, fontWeight: 700, color: C.accentText }}>T</div>
          <span style={{ fontFamily: MONO, fontSize: 13, color: C.text, letterSpacing: 0.3 }}>TeamForge</span>
        </div>

        <div style={{ fontSize: 10.5, color: C.textFaint, letterSpacing: 0.4, textTransform: "uppercase", padding: "0 6px", marginBottom: 8 }}>Product Team</div>

        {nav.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          return (
            <div key={item.id} onClick={() => navigate(item.path)} style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 8px", borderRadius: 6, marginBottom: 2, cursor: "pointer", background: active ? C.panel2 : "transparent", color: active ? C.text : C.textMuted }}>
              <Icon size={14} />
              <span style={{ fontSize: 13 }}>{item.label}</span>
            </div>
          );
        })}

        <div style={{ fontSize: 10.5, color: C.textFaint, letterSpacing: 0.4, textTransform: "uppercase", padding: "0 6px", marginTop: 22, marginBottom: 8 }}>Projects</div>

        {["Sprint 1", "Backend Utils", "Mobile App"].map((project, index) => (
          <div key={project} style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 8px", borderRadius: 6, cursor: "pointer", color: index === 0 ? C.text : C.textMuted, background: index === 0 ? C.panel2 : "transparent" }}>
            <Hash size={13} color={C.textFaint} />
            <span style={{ fontSize: 13 }}>{project}</span>
          </div>
        ))}

        <div onClick={() => navigate("/login")} style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 9, padding: "10px 6px", borderTop: `1px solid ${C.borderSoft}`, cursor: "pointer" }}>
          <Avatar initials="AF" size={26} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, color: C.text }}>Ali Fouda</div>
            <div style={{ fontSize: 10.5, color: C.textFaint }}>Owner</div>
          </div>
          <LogOut size={13} color={C.textFaint} />
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default AppLayout;