import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import { C, FONT } from "../../constants/theme";
import { useWorkspaceStore } from "../../store/useWorkspaceStore";
import { useNavigate, useParams } from "react-router-dom";
import Field from "../../components/ui/Field";
import TextArea from "../../components/ui/TextArea";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";

function WorkspaceSettingsPage() {
  const { workspaceId: id } = useParams();
    const navigate = useNavigate();
  const {
    workspaces,
    updateWorkspace,
    deleteWorkspace,
    getAllWorkspace,
  } = useWorkspaceStore();
  const workspace = workspaces.find((w) => w.id === id);
  const [formData, setFormData] = useState({
    name: workspace?.name || "",
    description: workspace?.description || "",
    iconUrl: workspace?.iconUrl || "",
  });
// console.log("workspace", formData);
  const [originalData, setOriginalData] = useState({
    name: "",
    description: "",
    iconUrl: "",
  });

  const [workspaceToDelete, setWorkspaceToDelete] = useState(false);
  const handleDelete = async () => {
    if (!workspaceToDelete) return;
    const workspaceId = workspaceToDelete.id;
    setWorkspaceToDelete(null);
    try {
      await deleteWorkspace(workspaceId);
    } catch (error) {
      console.error("Delete workspace failed:", error);
    }
  };
useEffect(() => {
    getAllWorkspace();
  }, [getAllWorkspace]);  
  useEffect(() => {
    if (!workspace) return;
    const data = {
      name: workspace.name || "",
      description: workspace.description || "",
      iconUrl: workspace.iconUrl || "",
    };
    setFormData(data);
    setOriginalData(data);
  }, [workspace]);

  const hasChanges =
    formData.name !== originalData.name ||
    formData.description !== originalData.description ||
    formData.iconUrl !== originalData.iconUrl;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasChanges) return;
    // console.log("workspace", formData);
    await updateWorkspace(id, formData);
    toast.success("Workspace updated successfully");
    navigate("/workspaces");
  };
  if (!workspace) {
    return <div>Workspace not found</div>;
  }
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
        <h2
          style={{
            color: C.text,
            marginBottom: 24,
          }}
        >
          Workspace settings
        </h2>
        <form onSubmit={handleSubmit}>
          <Field
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Workspace name"
          />
          <TextArea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
          />
          <Field
            name="iconUrl"
            value={formData.iconUrl}
            onChange={handleChange}
            placeholder="Icon URL"
          />
          <Button
            type="submit"
            disabled={!hasChanges}
          >
            Update
          </Button>
        </form>
        {/* <div style={{ fontSize: 11, color: C.textFaint, textTransform: "uppercase", letterSpacing: 0.4, margin: "30px 0 12px" }}>Notifications</div>
        {["Task assigned to me", "Someone comments on my task", "Weekly digest email"].map((label) => (
        <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.borderSoft}` }}>
            <span style={{ fontSize: 13, color: C.text }}>{label}</span>
            <div style={{ width: 34, height: 19, borderRadius: 10, background: C.accentDim, position: "relative", cursor: "pointer" }}>
                <div style={{ width: 15, height: 15, borderRadius: 8, background: C.accent, position: "absolute", top: 2, right: 2 }} />
            </div>
        </div>
        ))} */}
        <div style={{ fontSize: 11, color: C.textFaint, textTransform: "uppercase", letterSpacing: 0.4, margin: "30px 0 12px" }}>Danger zone</div>
        <div style={{ border: `1px solid ${C.red}33`, borderRadius: 10, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
                <div style={{ fontSize: 13, color: C.text }}>Delete this workspace</div>
                <div style={{ fontSize: 11.5, color: C.textFaint }}>This can't be undone.</div>
            </div>
            <Button variant="danger" icon={Trash2} onClick={() => setWorkspaceToDelete(true)}>Delete</Button>
        </div>
        {workspaceToDelete && (
          <ConfirmationModal
            title="Delete workspace"
            message={`Are you sure you want to delete Workspace "${workspace.name}"?`}
            confirmText="Delete"
            cancelText="Cancel"
            onCancel={() => setWorkspaceToDelete(false)}
            onConfirm={handleDelete}
          />
        )}
      </div>
    </div>
  );
}

export default WorkspaceSettingsPage;