import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Hash, Pencil, Trash2 } from "lucide-react";
import { C, FONT } from "../../constants/theme";
import PageHeader from "../../components/PageHeader";
import Button from "../../components/ui/Button";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import CreateProjectModal from "./CreateProjectModal";
import EditProjectModal from "./EditProjectModal";
import { useProjectStore } from "../../store/useProjectStore";
import { toast } from "react-toastify";

function ProjectsPage() {
  const { workspaceId } = useParams();
  const [showCreate, setShowCreate] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const { projects, getWorkspaceProjects, deleteProject, isLoading, isDeleting, error } = useProjectStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (workspaceId) {
      getWorkspaceProjects(workspaceId);
    }
  }, [workspaceId, getWorkspaceProjects]);

  const handleDelete = async () => {
    if (!projectToDelete) return;
    try {
      await deleteProject(projectToDelete.id);
      toast.success("Project deleted successfully");
      setProjectToDelete(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete project");
    }
  };

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
              onClick={() =>
                navigate(
                  `/workspaces/${workspaceId}/projects/${p.id}/boards`
                )
              }
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: C.panel,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: "16px 18px",
                marginBottom: 10,
                cursor: "pointer",
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
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setProjectToEdit(p);
                  }}
                  title="Edit project"
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 7,
                    background: "transparent",
                    border: `1px solid ${C.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Pencil size={13} color={C.textMuted} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setProjectToDelete(p);
                  }}
                  title="Delete project"
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 7,
                    background: "transparent",
                    border: `1px solid ${C.red}44`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Trash2 size={13} color={C.red} />
                </button>
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

      {projectToEdit && (
        <EditProjectModal
          project={projectToEdit}
          onClose={() => setProjectToEdit(null)}
        />
      )}

      {projectToDelete && (
        <ConfirmationModal
          title="Delete project"
          message={`Are you sure you want to delete project "${projectToDelete.name}"? This can't be undone.`}
          confirmText={isDeleting ? "Deleting..." : "Delete"}
          cancelText="Cancel"
          onCancel={() => setProjectToDelete(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

export default ProjectsPage;
