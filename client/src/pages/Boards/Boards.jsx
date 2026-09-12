import { useState } from "react";
import PageHeader from "../../components/PageHeader";
import Button from "../../components/ui/Button";
import { C, MONO } from "../../constants/theme";
import Avatar from "../../components/ui/Avatar";
import CreateBoardModal from "./CreateBoardModal";

function BoardsPage() {
    const [showCreate, setShowCreate] = useState(false);
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
                {Array.from({ length: 3 }).map((_, idx) => (
                    <div
                        key={idx}
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1.5fr 120px",
                            alignItems: "center",
                            padding: "12px 16px",
                            borderBottom: idx !== 2 ? `1px solid ${C.borderSoft}` : "none",
                        }}
                    >
                        <div
                            style={{
                                fontSize: 13.5,
                                color: C.text,
                            }}
                        >
                            Board {idx + 1}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <Avatar initials={"AB"} size={32} />
                            <div>
                                <div style={{ fontSize: 13.5, color: C.text }}>Ahmed Bouhlel</div>
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
