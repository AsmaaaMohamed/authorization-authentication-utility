import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import { C, FONT } from "../../constants/theme";
import { useWorkspaceStore } from "../../store/useWorkspaceStore";
import { useNavigate, useParams } from "react-router-dom";
import Field from "../../components/ui/Field";
import TextArea from "../../components/ui/TextArea";
import { toast } from "react-toastify";

function WorkspaceSettingsPage() {
  const { id } = useParams();
    const navigate = useNavigate();
  const {
    workspaces,
    updateWorkspace,
    deleteWorkspace,
  } = useWorkspaceStore();

  const workspace = workspaces.find((w) => w.id === id);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    iconUrl: "",
  });

  const [originalData, setOriginalData] = useState({
    name: "",
    description: "",
    iconUrl: "",
  });

  const [workspaceToDelete, setWorkspaceToDelete] = useState(false);

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

    await updateWorkspace(id, formData);
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

        <div
          style={{
            marginTop: 40,
            paddingTop: 24,
            borderTop: `1px solid ${C.border}`,
          }}
        >
          <h3 style={{ color: C.text }}>
            Danger zone
          </h3>

          <Button
            variant="danger"
            onClick={() => setWorkspaceToDelete(true)}
          >
            Delete workspace
          </Button>
        </div>

        {workspaceToDelete && (
          <ConfirmationModal
            title="Delete workspace"
            message={`Are you sure you want to delete Workspace "${workspace.name}"?`}
            confirmText="Delete"
            cancelText="Cancel"
            onCancel={() => setWorkspaceToDelete(false)}
            onConfirm={async () => {
                await deleteWorkspace(id);
                setWorkspaceToDelete(false);
                toast.success("Workspace deleted successfully");
                navigate("/workspaces");
            }}
          />
        )}
      </div>
    </div>
  );
}

export default WorkspaceSettingsPage;