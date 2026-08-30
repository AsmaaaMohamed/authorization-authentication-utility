import { Hash } from "lucide-react";
import Button from "../../components/ui/Button";
import Field from "../../components/ui/Field";
import FileDrop from "../../components/ui/FileDrop";
import TextArea from "../../components/ui/TextArea";
import Modal from "../../components/ui/Modal";
import { useState } from "react";
import { useWorkspaceStore } from "../../store/useWorkspaceStore";

function CreateWorkspaceModal({ onClose  }) {
  const { createWorkspace, isLoading } = useWorkspaceStore();
  const [workspaceFormData, setWorkspaceFormData] = useState({name: "", description: "", icon: null});
  const [error, setError] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkspaceFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setWorkspaceFormData((prev) => ({
      ...prev,
      icon: file,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!workspaceFormData.name.trim()) {
      setError("Workspace name is required");
      return;
    }
    try {
      await createWorkspace(workspaceFormData);
      onClose();
    } catch (error) {
      console.log(error);
      setError("Failed to create workspace");
    }
  };
  return (
    <Modal title="New workspace" onClose={onClose}>
       <form onSubmit={handleSubmit}>
          <Field
            label="Workspace name"
            required
            icon={Hash}
            placeholder="e.g. Product Team"
            name="name"
            value={workspaceFormData.name}
            onChange={handleChange}
          />
          <TextArea
            label="Description (optional)"
            placeholder="What's this workspace for?"
            name="description"
            value={workspaceFormData.description}
            onChange={handleChange}
          />
          <FileDrop
            label="Workspace icon (optional)"
            hint="Square image, up to 2MB"
            onChange={handleFileChange}
            file={workspaceFormData.icon}
            name="icon"
          />
          {error && (
            <div style={{ color: "red", fontSize: 12 }}>
              {error}
            </div>
          )}
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <Button
              variant="secondary"
              full
              type="button"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              full
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create workspace"}
            </Button>
          </div>
      </form>
    </Modal>
  );
}

export default CreateWorkspaceModal;