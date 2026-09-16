import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import { C, FONT } from "../../constants/theme";
import { useWorkspaceStore } from "../../store";
import { useNavigate, useParams } from "react-router-dom";
import Field from "../../components/ui/Field";
import TextArea from "../../components/ui/TextArea";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";

function WorkspaceSettingsPage() {
  const { workspaceId: id } = useParams();
  const navigate = useNavigate();
  const { workspaces, updateWorkspace, deleteWorkspace, getAllWorkspace } = useWorkspaceStore();
  const workspace = workspaces.find((w) => w.id === id || w._id === id);

  const [formData, setFormData] = useState({
    name: workspace?.name || "",
    description: workspace?.description || "",
    iconUrl: workspace?.iconUrl || "",
  });

  const [originalData, setOriginalData] = useState({
    name: "",
    description: "",
    iconUrl: "",
  });

  const [workspaceToDelete, setWorkspaceToDelete] = useState(false);

  useEffect(() => {
    if (id) {
      getAllWorkspace();
    }
  }, [getAllWorkspace, id]);

  useEffect(() => {
    if (!workspace) return;

    const nextForm = {
      name: workspace.name || "",
      description: workspace.description || "",
      iconUrl: workspace.iconUrl || "",
    };

    setFormData(nextForm);
    setOriginalData(nextForm);
  }, [workspace]);

  const hasChanges =
    formData.name !== originalData.name ||
    formData.description !== originalData.description ||
    formData.iconUrl !== originalData.iconUrl;

  const handleDelete = async () => {
    if (!workspaceToDelete) return;
    setWorkspaceToDelete(false);
    try {
      await deleteWorkspace(id);
      toast.success("Workspace deleted successfully");
      navigate("/workspaces");
    } catch (error) {
      console.error("Delete workspace failed:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasChanges || !id) return;

    try {
      await updateWorkspace(id, formData);
      toast.success("Workspace updated successfully");
      await getAllWorkspace();
      navigate("/workspaces");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update workspace");
    }
  };

  if (!workspace) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, padding: "40px 28px" }}>
        Workspace not found
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        fontFamily: FONT,
        padding: "40px 28px",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto", width: "100%" }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: C.textFaint, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 8 }}>
            Workspace settings
          </div>
          <h2 style={{ color: C.text, margin: 0 }}>{workspace.name}</h2>
        </div>

        <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
          <form onSubmit={handleSubmit}>
            <Field name="name" value={formData.name} onChange={handleChange} placeholder="Workspace name" />
            <TextArea name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
            <Field name="iconUrl" value={formData.iconUrl} onChange={handleChange} placeholder="Icon URL" />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
              <Button type="submit" disabled={!hasChanges}>
                Update workspace
              </Button>
            </div>
          </form>
        </div>

        <div style={{ fontSize: 11, color: C.textFaint, textTransform: "uppercase", letterSpacing: 0.4, margin: "30px 0 12px" }}>
          Danger zone
        </div>
        <div style={{ border: `1px solid ${C.red}33`, borderRadius: 10, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", background: C.panel }}>
          <div>
            <div style={{ fontSize: 13, color: C.text }}>Delete this workspace</div>
            <div style={{ fontSize: 11.5, color: C.textFaint }}>This can't be undone.</div>
          </div>
          <Button variant="danger" icon={Trash2} onClick={() => setWorkspaceToDelete(true)}>
            Delete
          </Button>
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