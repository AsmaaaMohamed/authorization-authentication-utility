import { useEffect, useState } from "react";
import { C, FONT, MONO } from "../../constants/theme";
import { ChevronRight, Plus } from "lucide-react";
import Button from "../../components/ui/Button";
import CreateWorkspaceModal from "./CreateWorkSpacesModal";
import { useNavigate } from "react-router-dom";
import { useWorkspaceStore } from "../../store/useWorkspaceStore";
import ConfirmationModal from "../../components/ui/ConfirmationModal";

function WorkspacesPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState(null);

  const navigate = useNavigate();

  const { workspaces, getAllWorkspace, deleteWorkspace, isLoading, error } =
    useWorkspaceStore();

  useEffect(() => {
    getAllWorkspace();
  }, [getAllWorkspace]);

  const handleDelete = async () => {
    if (!workspaceToDelete) return;

    const workspaceId = workspaceToDelete._id;

    setWorkspaceToDelete(null);

    try {
      await deleteWorkspace(workspaceId);
    } catch (error) {
      console.error("Delete workspace failed:", error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        fontFamily: FONT,
        padding: "40px 28px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 20,
                color: C.text,
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              Your workspaces
            </div>

            <div
              style={{
                fontSize: 13,
                color: C.textFaint,
              }}
            >
              Pick one to continue, or start a new one.
            </div>
          </div>

          <Button icon={Plus} onClick={() => setShowCreate(true)}>
            New workspace
          </Button>
        </div>

        {isLoading && (
          <div
            style={{
              color: C.textMuted,
              textAlign: "center",
              padding: 30,
            }}
          >
            Loading workspaces...
          </div>
        )}

        {error && (
          <div
            style={{
              color: C.red,
              textAlign: "center",
              padding: 20,
            }}
          >
            {error}
          </div>
        )}

        {!isLoading &&
          !error &&
          workspaces.map((w) => (
            <div
              key={w.id}
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 13,
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/board/${w.id}`)}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: C.panel2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: MONO,
                    fontSize: 14,
                    color: C.accent,
                  }}
                >
                  {w.name?.[0]}
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 14,
                      color: C.text,
                      fontWeight: 500,
                    }}
                  >
                    {w.name}
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: C.textFaint,
                    }}
                  >
                    {w.members ?? 0} members · {w.projects ?? 0} projects
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 11,
                    color: C.textMuted,
                    background: C.panel2,
                    padding: "3px 8px",
                    borderRadius: 5,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  {w.role}
                </span>

                <ChevronRight size={15} color={C.textFaint} />

                <Button
                  variant="danger"
                  onClick={() => {
                    setWorkspaceToDelete(w);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}

        {workspaceToDelete && (
          <ConfirmationModal
            title="Delete workspace"
            message={`Are you sure you want to delete workspace "${workspaceToDelete.name}"?`}
            confirmText="Delete"
            cancelText="Cancel"
            onCancel={() => setWorkspaceToDelete(null)}
            onConfirm={handleDelete}
          />
        )}
      </div>

      {showCreate && (
        <CreateWorkspaceModal onClose={() => setShowCreate(false)} />
      )}
    </div>
  );
}

export default WorkspacesPage;
