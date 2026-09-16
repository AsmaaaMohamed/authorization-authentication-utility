import { useEffect, useState } from "react";
import { C, FONT, MONO } from "../../constants/theme";
import { ArrowUpRight, FolderKanban, Plus, Settings, Sparkles, Users } from "lucide-react";
import Button from "../../components/ui/Button";
import CreateWorkspaceModal from "./CreateWorkSpacesModal";
import { useNavigate } from "react-router-dom";
import { useWorkspaceStore } from "../../store";

function WorkspacesPage() {
  const [showCreate, setShowCreate] = useState(false);
  const navigate = useNavigate();
  const { workspaces, getAllWorkspace, isLoading, error } = useWorkspaceStore();

  useEffect(() => {
    getAllWorkspace();
  }, [getAllWorkspace]);

  const totalMembers = workspaces.reduce((sum, workspace) => sum + (workspace.memberCount || 0), 0);
  const totalProjects = workspaces.reduce((sum, workspace) => sum + (workspace.projectCount || 0), 0);

  const summaryCards = [
    { label: "Workspaces", value: workspaces.length, icon: FolderKanban },
    { label: "Members", value: totalMembers, icon: Users },
    { label: "Projects", value: totalProjects, icon: Sparkles },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FONT, padding: "40px 28px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            marginBottom: 22,
            padding: "18px 20px",
            background: "linear-gradient(135deg, rgba(79,70,229,0.10), rgba(79,70,229,0.02))",
            border: `1px solid ${C.border}`,
            borderRadius: 18,
          }}
        >
          <div>
            <div style={{ fontSize: 12, color: C.textFaint, letterSpacing: 0.7, textTransform: "uppercase", marginBottom: 4 }}>
              Workspace overview
            </div>
            <div style={{ fontSize: 28, color: C.text, fontWeight: 700 }}>Your workspaces</div>
          </div>
          <Button icon={Plus} onClick={() => setShowCreate(true)}>
            New workspace
          </Button>
        </div>

        {!isLoading && !error && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 14,
              marginBottom: 20,
            }}
          >
            {summaryCards.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                style={{
                  background: C.panel,
                  border: `1px solid ${C.border}`,
                  borderRadius: 14,
                  padding: "16px 18px",
                  boxShadow: `0 10px 30px ${C.shadow}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontSize: 12, color: C.textFaint, textTransform: "uppercase", letterSpacing: 0.7 }}>{label}</div>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: C.panel2,
                      color: C.accent,
                    }}
                  >
                    <Icon size={15} />
                  </div>
                </div>
                <div style={{ fontSize: 28, lineHeight: 1.1, color: C.text, fontWeight: 700 }}>{value}</div>
              </div>
            ))}
          </div>
        )}

        {isLoading && (
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 28, textAlign: "center", color: C.textMuted }}>
            Loading workspaces...
          </div>
        )}

        {error && (
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, textAlign: "center", color: C.red }}>
            {error}
          </div>
        )}

        {!isLoading && !error && workspaces.length === 0 && (
          <div
            style={{
              background: C.panel,
              border: `1px solid ${C.border}`,
              borderRadius: 14,
              padding: "28px 20px",
              textAlign: "center",
              color: C.textFaint,
            }}
          >
            No workspaces yet. Create your first workspace to get started.
          </div>
        )}

        {!isLoading && !error && workspaces.map((workspace) => {
          const workspaceId = workspace.id || workspace._id;
          const initial = (workspace.name || "W").charAt(0).toUpperCase();
          const roleText = (workspace.role || "MEMBER").toUpperCase();

          return (
            <div
              key={workspaceId}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) auto",
                gap: 16,
                alignItems: "center",
                background: C.panel,
                border: `1px solid ${C.border}`,
                borderRadius: 16,
                padding: "18px 18px",
                marginBottom: 14,
                boxShadow: `0 8px 24px ${C.shadow}`,
                transition: "transform 0.2s ease, border-color 0.2s ease",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}
                onClick={() => navigate(`/workspaces/${workspaceId}/projects`)}
              >
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 14,
                    background: "linear-gradient(135deg, rgba(79,70,229,0.22), rgba(79,70,229,0.06))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: MONO,
                    fontSize: 18,
                    color: C.accent,
                    fontWeight: 700,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  {initial}
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                    <div style={{ fontSize: 16, color: C.text, fontWeight: 700 }}>{workspace.name}</div>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "4px 8px",
                        borderRadius: 999,
                        background: C.panel2,
                        border: `1px solid ${C.border}`,
                        color: C.textMuted,
                        fontSize: 11,
                        letterSpacing: 0.4,
                        textTransform: "uppercase",
                      }}
                    >
                      {roleText}
                    </div>
                  </div>

                  <div style={{ fontSize: 12, color: C.textFaint }}>
                    {workspace.memberCount || 0} members · {workspace.projectCount || 0} projects
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => navigate(`/workspaces/${workspaceId}/projects`)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    border: `1px solid ${C.border}`,
                    background: C.panel2,
                    color: C.text,
                    borderRadius: 10,
                    padding: "8px 12px",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  Open <ArrowUpRight size={14} />
                </button>

                <div
                  title="Settings"
                  onClick={() => navigate(`/workspaces/${workspaceId}/settings`)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    cursor: "pointer",
                    background: C.panel2,
                    border: `1px solid ${C.border}`,
                    color: C.textFaint,
                  }}
                >
                  <Settings size={16} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {showCreate && <CreateWorkspaceModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}

export default WorkspacesPage;
