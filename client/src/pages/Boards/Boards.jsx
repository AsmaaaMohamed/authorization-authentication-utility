import { useState } from "react";
import PageHeader from "../../components/PageHeader";
import Button from "../../components/ui/Button";
import { C, MONO } from "../../constants/theme";
import Avatar from "../../components/ui/Avatar";
import CreateBoardModal from "./CreateBoardModal";
import { useWorkspaceStore } from "../../store";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function BoardsPage() {
    const [showCreate, setShowCreate] = useState(false);
    const {boards, getBoards , isLoading, error} = useWorkspaceStore();
    const {projectId} = useParams();
    const navigate = useNavigate();
    const getInitials = (name) => {
        return name
        .split(" ")
        .filter(Boolean)
        .map((word) => word[0].toUpperCase())
        .slice(0, 2)
        .join("");
    };
    // console.log("Rendering BoardsPage, showCreate:", showCreate); // Log the state of showCreate
    useEffect(() => {
        // Fetch boards when the component mounts
        getBoards(projectId);
    }, [getBoards, projectId]);
    return (
        <div>
            <PageHeader
                title="Boards"
                subtitle="Manage your boards"
                action={
                    <Button variant="primary" onClick={() => setShowCreate(true)}>
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
                {/* Header */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1.5fr 120px",
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
                </div>

                {/* Rows */}
                {console.log("Boards data:", boards)} {/* Log the boards data to verify it's being retrieved correctly */}
                {boards?.map((board, idx) => (
                    <div
                        key={idx}
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1.5fr 120px",
                            alignItems: "center",
                            padding: "12px 16px",
                            borderBottom: idx !== (boards.length - 1) ? `1px solid ${C.borderSoft}` : "none",
                            cursor: "pointer",
                        }}
                        onClick={() => navigate(`${board.id}`)}
                    >
                        <div
                            style={{
                                fontSize: 13.5,
                                color: C.text,
                            }}
                        >
                            {board.name}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <Avatar initials={getInitials(board?.createdBy.name)} size={32} />
                            <div>
                                <div style={{ fontSize: 13.5, color: C.text }}>{board.createdBy.name}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {showCreate && <CreateBoardModal onClose={() => setShowCreate(false)}/>}
        </div>
    );
}

export default BoardsPage;
