import { useState } from "react";
import PageHeader from "../../components/PageHeader";
import Button from "../../components/ui/Button";
import { C, MONO } from "../../constants/theme";
import Avatar from "../../components/ui/Avatar";
import CreateBoardModal from "./CreateBoardModal";
import { useWorkspaceStore } from "../../store";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmationModal from "../../components/ui/ConfirmationModal";

function BoardsPage() {
  const [boardModal, setBoardModal] = useState(null);
  const [boardToDelete, setBoardToDelete] = useState(null);
  const {
    boards,
    getBoards,
    deleteBoard,
    isLoading,
    error,
  } = useWorkspaceStore();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const getInitials = (name) => {
    return name
      ?.split(" ")
      .filter(Boolean)
      .map((word) => word[0].toUpperCase())
      .slice(0, 2)
      .join("");
  };
  const handleEdit = (board) => {
    setBoardModal({
      mode: "edit",
      board,
    });
  };
 const handleDelete = async () => {
    if (!boardToDelete) return;
    try {
        await deleteBoard(projectId, boardToDelete.id);
        setBoardToDelete(null);
    } catch (error) {
        console.log(error);
    }
};
  useEffect(() => {
    getBoards(projectId);
  }, [getBoards, projectId]);
console.log("BOARDS:", boards);
  return (
    <div>
      <PageHeader
        title="Boards"
        subtitle="Manage your boards"
        action={
          <Button
            variant="primary"
            onClick={() => setBoardModal({ mode: "create" })}
          >
            New Board
          </Button>
        }
      />

      <div
        style={{
          border: `1px solid ${C.border}`,
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        {isLoading && (
          <div
            style={{
              color: C.textMuted,
              textAlign: "center",
              padding: 30,
            }}
          >
            Loading boards...
          </div>
        )}

        {error && !isLoading && (
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

        {!isLoading && !error && boards.length === 0 && (
          <div
            style={{
              color: C.textFaint,
              textAlign: "center",
              padding: 30,
              fontSize: 13.5,
            }}
          >
            No boards yet. Create your first one to get started.
          </div>
        )}

        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.5fr 180px",
            alignItems: "center",
            padding: "12px 16px",
            background: C.panel2,
            borderBottom: `1px solid ${C.border}`,
            fontSize: 12,
            color: C.textMuted,
            fontFamily: MONO,
          }}
        >
          <span>Board</span>
          <span>Admin</span>
          <span></span>
        </div>

        {/* Rows */}
        {!isLoading &&
          !error &&
          boards?.map((board, idx) => (
            <div
              key={idx}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1.5fr 180px",
                alignItems: "center",
                padding: "12px 16px",
                borderBottom:
                  idx !== boards.length - 1
                    ? `1px solid ${C.borderSoft}`
                    : "none",
                cursor: "pointer",
              }}
              onClick={() => navigate(`${board.id}`)}
            >
              {/* Board */}
              <div
                style={{
                  fontSize: 13.5,
                  color: C.text,
                }}
              >
                {board.name}
              </div>

              {/* Admin */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <Avatar
                  initials={getInitials(board?.createdBy?.name)}
                  size={32}
                />

                <div
                  style={{
                    fontSize: 13.5,
                    color: C.text,
                  }}
                >
                  {board?.createdBy?.name}
                </div>
              </div>

              {/* Actions */}
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Button
                  variant="textAccent"
                  onClick={() => handleEdit(board)}
                >
                  Edit
                </Button>

                <Button
                  variant="danger"
                  onClick={() => setBoardToDelete(board)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
      </div>

      {/* Create / Edit Modal */}
      {boardModal && (
        <CreateBoardModal
          board={
            boardModal.mode === "edit"
              ? boardModal.board
              : null
          }
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
