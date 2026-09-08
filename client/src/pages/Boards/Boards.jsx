import { useState } from "react";
import PageHeader from "../../components/PageHeader";
import Button from "../../components/ui/Button";

function BoardsPage() {
    const [showInvite, setShowInvite] = useState(false);
    return (
        <div>
            <PageHeader title="Boards" subtitle="Manage your boards" action={<Button variant="primary" onClick={() => setShowNewBoard(true)}>New Board</Button>} />
            <div style={{ padding: "20px 28px" }}>
                {members?.map((m) => (
                <div key={m.email} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 4px", borderBottom: `1px solid ${C.borderSoft}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Avatar initials={m.initials} size={32} />
                    <div>
                        <div style={{ fontSize: 13.5, color: C.text }}>{m.name}</div>
                        <div style={{ fontSize: 12, color: C.textFaint }}>{m.email}</div>
                    </div>
                    </div>
                    <span style={{ fontFamily: MONO, fontSize: 11, color: C.textMuted, background: C.panel2, padding: "3px 9px", borderRadius: 5, border: `1px solid ${C.border}` }}>{m.role}</span>
                </div>
                ))}
            </div>
            {showInvite && <InviteModal onClose={() => setShowInvite(false)} workspaceId={workspaceId} />}
    </div>
    );
}

export default BoardsPage;