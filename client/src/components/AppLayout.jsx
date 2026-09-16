import {
  Bell,
  FolderKanban,
  LogOut,
  Moon,
  SettingsIcon,
  Sparkles,
  SunMedium,
  Users,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate, useLocation, useParams } from "react-router-dom";
import { C, FONT, MONO } from "../constants/theme";
import { logout, useAuthStore, useThemeStore } from "../store";
import Avatar from "./ui/Avatar";

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { workspaceId } = useParams();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const user = useAuthStore((state) => state.userData);

  useEffect(() => {
    const updateLayout = () => setIsMobile(window.innerWidth < 900);
    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  const userLabel = user?.name || "Workspace user";
  const initials = userLabel
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const nav = useMemo(
    () => [
      { id: "projects", icon: FolderKanban, label: "Projects", path: "/projects" },
      { id: "members", icon: Users, label: "Members", path: "/members" },
      { id: "notifications", icon: Bell, label: "Notifications", path: "/notifications" },
      { id: "settings", icon: SettingsIcon, label: "Settings", path: "/settings" },
    ],
    [],
  );

  const handleNavigate = (path) => {
    if (workspaceId) {
      navigate(`/workspaces/${workspaceId}${path}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navButtonStyle = (active, collapsedState) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: collapsedState ? "center" : "flex-start",
    gap: 10,
    padding: collapsedState ? "10px 8px" : "10px 12px",
    borderRadius: 12,
    border: active ? `1px solid ${C.border}` : "1px solid transparent",
    background: active ? C.panel2 : "transparent",
    color: active ? C.text : C.textMuted,
    cursor: "pointer",
    textAlign: "left",
    transition: "all 180ms ease",
    boxShadow: active ? `0 8px 18px ${C.shadow}` : "none",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        height: "100vh",
        width: "100%",
        background: C.bg,
        fontFamily: FONT,
      }}
    >
      <aside
        style={{
          width: isMobile ? "100%" : collapsed ? 88 : 220,
          background: C.bg,
          borderRight: isMobile ? "none" : `1px solid ${C.border}`,
          borderBottom: isMobile ? `1px solid ${C.border}` : "none",
          padding: isMobile ? "14px 14px 10px" : collapsed ? "18px 10px" : "18px 12px",
          display: "flex",
          flexDirection: isMobile ? "column" : "column",
          flexShrink: 0,
          transition: "width 180ms ease",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            padding: isMobile ? "0 4px 10px" : collapsed ? "0 4px" : "0 6px",
            marginBottom: isMobile ? 8 : 22,
          }}
        >
          <div onClick={() => navigate("/workspaces")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <div style={{ width: 28, height: 28, borderRadius: 10, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 12, fontWeight: 700, color: C.accentText }}>T</div>
            {!collapsed && !isMobile && <span style={{ fontFamily: MONO, fontSize: 13, color: C.text, letterSpacing: 0.3 }}>TeamForge</span>}
          </div>

          {!isMobile && (
            <button
              type="button"
              onClick={() => setCollapsed((value) => !value)}
              style={{
                width: 30,
                height: 30,
                borderRadius: 10,
                border: `1px solid ${C.border}`,
                background: C.panel,
                color: C.textMuted,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              aria-label="Toggle sidebar"
            >
              {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
            </button>
          )}
        </div>

        {!isMobile && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, padding: collapsed ? "0 4px" : "0 6px" }}>
            {!collapsed && (
              <div style={{ fontSize: 10.5, color: C.textFaint, letterSpacing: 0.45, textTransform: "uppercase" }}>Workspace</div>
            )}
          </div>
        )}

        <nav
          style={{
            display: "flex",
            flexDirection: isMobile ? "row" : "column",
            gap: isMobile ? 8 : 6,
            overflowX: isMobile ? "auto" : "visible",
            paddingBottom: isMobile ? 4 : 0,
          }}
        >
          {nav.map((item) => {
            const Icon = item.icon;
            const active = location.pathname.includes(item.path);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.path)}
                style={{
                  ...navButtonStyle(active, collapsed || isMobile),
                  minWidth: isMobile ? 120 : "auto",
                  flexShrink: 0,
                }}
                title={item.label}
              >
                <Icon size={15} />
                {!((collapsed || isMobile) && isMobile ? false : collapsed) && <span style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {!isMobile && (
          <div style={{ marginTop: "auto", paddingTop: 14, borderTop: `1px solid ${C.borderSoft}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: collapsed ? "10px 6px" : "10px 8px" }}>
              <Avatar initials={initials} size={collapsed ? 26 : 30} />
              {!collapsed && (
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, color: C.text, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{userLabel}</div>
                  <div style={{ fontSize: 10.5, color: C.textFaint }}>Owner</div>
                </div>
              )}
              {!collapsed && (
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: C.textFaint,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  aria-label="Logout"
                >
                  <LogOut size={14} />
                </button>
              )}
            </div>
          </div>
        )}
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: isMobile ? "12px 16px" : "14px 24px",
            borderBottom: `1px solid ${C.border}`,
            background: "color-mix(in srgb, var(--panel) 85%, transparent)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Sparkles size={15} color={C.accent} />
            <span style={{ fontSize: 12, color: C.textMuted, letterSpacing: "0.04em", textTransform: "uppercase" }}>Workspace overview</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {isMobile && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "6px 8px" }}>
                <Avatar initials={initials} size={22} />
                <span style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>{userLabel.split(" ")[0]}</span>
              </div>
            )}
            <button
              type="button"
              onClick={toggleTheme}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                border: `1px solid ${C.border}`,
                background: C.panel,
                color: C.text,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              aria-label="Toggle color theme"
            >
              {theme === "dark" ? <SunMedium size={15} /> : <Moon size={15} />}
            </button>
            {isMobile && (
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  border: `1px solid ${C.border}`,
                  background: C.panel,
                  color: C.text,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                aria-label="Logout"
              >
                <LogOut size={15} />
              </button>
            )}
          </div>
        </header>

        <main style={{ flex: 1, minHeight: 0, overflow: "auto", background: C.bg }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;