import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Plus, Hash } from "lucide-react";
import { C, FONT, MONO } from "../../constants/theme";
import PageHeader from "../../components/PageHeader";
import Button from "../../components/ui/Button";
import CreateProjectModal from "./CreateProjectModal";
import { useProjectStore } from "../../store/useProjectStore";

function ProjectsPage() {
  const { workspaceId } = useParams();
  const [showCreate, setShowCreate] = useState(false);
  const { projects, getWorkspaceProjects, isLoading, error } = useProjectStore();

  useEffect(() => {
    if (workspaceId) {
      getWorkspaceProjects(workspaceId);
    }
  }, [workspaceId, getWorkspaceProjects]);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FONT }}>
      <PageHeader
        title="Projects"
        subtitle="Projects in this workspace"
        action={
          <Button icon={Plus} onClick={() => setShowCreate(true)}>
            New project
          </Button>
        }
      />

      <div style={{ padding: "20px 28px" }}>
        {isLoading && (
          <div style={{ color: C.textMuted, textAlign: "center", padding: 30 }}>
            Loading projects...
          </div>
        )}

        {error && !isLoading && (
          <div style={{ color: C.red, textAlign: "center", padding: 20 }}>
            {error}
          </div>
        )}

        {!isLoading && !error && projects.length === 0 && (
          <div style={{ color: C.textFaint, textAlign: "center", padding: 30, fontSize: 13.5 }}>
            No projects yet. Create your first one to get started.
          </div>
        )}

        {!isLoading &&
          !error &&
          projects.map((p) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: C.panel,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: "16px 18px",
                marginBottom: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: C.panel2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Hash size={15} color={C.accent} />
                </div>
                <div>
                  <div style={{ fontSize: 14, color: C.text, fontWeight: 500 }}>
                    {p.name}
                  </div>
                  {p.description && (
                    <div style={{ fontSize: 12, color: C.textFaint }}>
                      {p.description}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>

      {showCreate && (
        <CreateProjectModal
          workspaceId={workspaceId}
          onClose={() => setShowCreate(false)}
        />
      )}
    </div>
  );
}

export default ProjectsPage;
