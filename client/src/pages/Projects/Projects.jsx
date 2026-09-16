import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Hash, ArrowRight, FolderKanban } from "lucide-react";
import { C, FONT } from "../../constants/theme";
import PageHeader from "../../components/PageHeader";
import Button from "../../components/ui/Button";
import CreateProjectModal from "./CreateProjectModal";
import { useProjectStore } from "../../store/useProjectStore";

function ProjectsPage() {
  const { workspaceId } = useParams();
  const [showCreate, setShowCreate] = useState(false);
  const { projects, getWorkspaceProjects, isLoading, error } = useProjectStore();
  const navigate = useNavigate();

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
        {!isLoading && !error && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 18 }}>
            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 12, color: C.textFaint, marginBottom: 8 }}>Total projects</div>
              <div style={{ fontSize: 26, color: C.text, fontWeight: 700 }}>{projects.length}</div>
            </div>
          </div>
        )}

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
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: "28px 20px", textAlign: "center", color: C.textFaint }}>
            No projects yet. Create your first one to get started.
          </div>
        )}

        {!isLoading && !error && projects.map((project) => (
          <div
            key={project.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: C.panel,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: "18px 18px",
              marginBottom: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 10,
                  background: C.panel2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FolderKanban size={16} color={C.accent} />
              </div>
              <div>
                <div style={{ fontSize: 15, color: C.text, fontWeight: 600 }}>{project.name}</div>
                {project.description && (
                  <div style={{ fontSize: 12, color: C.textFaint, marginTop: 4 }}>{project.description}</div>
                )}
              </div>
            </div>

            <Button
              variant="secondary"
              onClick={() => navigate(`/workspaces/${workspaceId}/projects/${project.id}/boards`)}
            >
              Open board
            </Button>
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
