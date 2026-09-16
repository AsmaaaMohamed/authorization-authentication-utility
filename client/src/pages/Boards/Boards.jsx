import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import Button from "../../components/ui/Button";
import { C, MONO } from "../../constants/theme";
import Avatar from "../../components/ui/Avatar";
import CreateBoardModal from "./CreateBoardModal";
import { useWorkspaceStore } from "../../store";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import { ArrowRight, FolderKanban, Plus } from "lucide-react";

function BoardsPage() {
  const [boardModal, setBoardModal] = useState(null);
  const [boardToDelete, setBoardToDelete] = useState(null);
  const { boards, getBoards, deleteBoard, isLoading, error } = useWorkspaceStore();
  const { projectId } = useParams();
  const navigate = useNavigate();

  const getInitials = (name) =>
    name
      ?.split(" ")
      .filter(Boolean)
      .map((word) => word[0].toUpperCase())
      .slice(0, 2)
      .join("") || "??";

  const handleEdit = (board) => setBoardModal({ mode: "edit", board });

  const handleDelete = async () => {
    if (!boardToDelete) return;
    try {
      await deleteBoard(projectId, boardToDelete.id);
      setBoardToDelete(null);
      getBoards(projectId);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBoards(projectId);
  }, [getBoards, projectId]);

  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      <PageHeader
        title="Boards"
        subtitle="Manage your project boards"
        action={
          <Button variant="primary" icon={Plus} onClick={() => setBoardModal({ mode: "create" })}>
            New Board
          </Button>
        }
      />

      <div style={{ padding: "20px 28px" }}>
        {!isLoading && !error && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 18 }}>
            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 12, color: C.textFaint, marginBottom: 8 }}>Total boards</div>
              <div style={{ fontSize: 26, color: C.text, fontWeight: 700 }}>{boards.length}</div>
            </div>
          </div>
        )}

        <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", background: C.panel }}>
          {isLoading && (
            <div style={{ color: C.textMuted, textAlign: "center", padding: 30 }}>Loading boards...</div>
          )}

          {error && !isLoading && (
            <div style={{ color: C.red, textAlign: "center", padding: 20 }}>{error}</div>
          )}

          {!isLoading && !error && boards.length === 0 && (
            <div style={{ color: C.textFaint, textAlign: "center", padding: 30, fontSize: 13.5 }}>
              No boards yet. Create your first one to get started.
            </div>
          )}

          {!isLoading && !error && boards.length > 0 && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 220px", padding: "12px 16px", background: C.panel2, borderBottom: `1px solid ${C.border}`, fontSize: 12, color: C.textMuted, fontFamily: MONO }}>
                <span>Board</span>
                <span>Admin</span>
                <span style={{ textAlign: "right" }}>Actions</span>
              </div>

              {boards.map((board, idx) => (
                <div
                  key={board.id || idx}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.2fr 1fr 220px",
                    alignItems: "center",
                    padding: "14px 16px",
                    borderBottom: idx !== boards.length - 1 ? `1px solid ${C.borderSoft}` : "none",
                    background: C.panel,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
                    onClick={() => navigate(`${board.id}`)}
                  >
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: C.panel2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <FolderKanban size={16} color={C.accent} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, color: C.text, fontWeight: 600 }}>{board.name}</div>
                      <div style={{ fontSize: 11.5, color: C.textFaint, marginTop: 4 }}>
                        {board.columns?.length || 0} columns
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar initials={getInitials(board?.createdBy?.name || board?.createdBy)} size={30} />
                    <div style={{ fontSize: 13.5, color: C.text }}>{board?.createdBy?.name || "Project admin"}</div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8 }}>
                    <Button variant="textAccent" onClick={() => handleEdit(board)}>Edit</Button>
                    <Button variant="danger" onClick={() => setBoardToDelete(board)}>Delete</Button>
                    <button
                      type="button"
                      onClick={() => navigate(`${board.id}`)}
                      style={{
                        background: "transparent",
                        border: `1px solid ${C.border}`,
                        borderRadius: 8,
                        color: C.text,
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                      aria-label={`Open ${board.name}`}
                    >
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {boardModal && (
        <CreateBoardModal
          board={boardModal.mode === "edit" ? boardModal.board : null}
          onClose={() => setBoardModal(null)}
        />
      )}

      {boardToDelete && (
        <ConfirmationModal
          title="Delete board"
          message={`Are you sure you want to delete board "${boardToDelete.name}"?`}
          confirmText="Delete"
          cancelText="Cancel"
          onCancel={() => setBoardToDelete(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

export default BoardsPage;
