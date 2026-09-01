import { useState } from "react";
import { C, FONT, MONO } from "../../constants/theme";
import { ChevronRight, Plus, Settings } from "lucide-react";
import Button from "../../components/ui/Button";
import CreateWorkspaceModal from "./CreateWorkSpacesModal";
import { useNavigate } from "react-router-dom";
import { useWorkspaceStore } from "../../store/useWorkspaceStore";
import ConfirmationModal from "../../components/ui/ConfirmationModal";

function WorkspacesPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState(null);
  const navigate = useNavigate();
  const {workspaces, deleteWorkspace } = useWorkspaceStore();
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FONT, padding: "40px 28px",display:"flex", alignItems:"center" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" , width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 20, color: C.text, fontWeight: 600, marginBottom: 4 }}>Your workspaces</div>
            <div style={{ fontSize: 13, color: C.textFaint }}>Pick one to continue, or start a new one.</div>
          </div>
          <Button icon={Plus} onClick={() => setShowCreate(true)}>New workspace</Button>
        </div>
        {workspaces.map((w) => (
          <div key={w.name}  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: C.panel, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 18px", marginBottom: 10,  }}>
            <div style={{ display: "flex", alignItems: "center", gap: 13, cursor: "pointer"}} onClick={() => navigate(`/workspaces/${w.id}/board`)}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: C.panel2, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 14, color: C.accent }}>{w.name[0]}</div>
              <div>
                <div style={{ fontSize: 14, color: C.text, fontWeight: 500 }}>{w.name}</div>
                <div style={{ fontSize: 12, color: C.textFaint }}>{w.members.length} members · {w.projects} projects</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontFamily: MONO, fontSize: 11, color: C.textMuted, background: C.panel2, padding: "3px 8px", borderRadius: 5, border: `1px solid ${C.border}` }}>{w.role}</span>
              <ChevronRight size={15} color={C.textFaint} />
              <div
                  title="Settings"
                  onClick={() => navigate(`/workspaces/${w.id}/settings`)}
                  style={{
                    cursor: "pointer",
                  }}
              >
                <Settings size={24} color={C.textFaint} title="Settings"/>
              </div>
              
            </div>
          </div>
        ))}
        {workspaceToDelete && (
            <ConfirmationModal
                title="Delete workspace"
                message={`Are you sure you want to delete Workspace "${workspaceToDelete.name}"?`}
                confirmText="Delete"
                cancelText="Cancel"
                onCancel={() => setWorkspaceToDelete(null)}
                onConfirm={() => {
                  deleteWorkspace(workspaceToDelete.id);
                  setWorkspaceToDelete(null);
                }}
              />
          )}
      </div>
      {showCreate && <CreateWorkspaceModal onClose={() => setShowCreate(false)}/>}
    </div>
  );
}

export default WorkspacesPage;