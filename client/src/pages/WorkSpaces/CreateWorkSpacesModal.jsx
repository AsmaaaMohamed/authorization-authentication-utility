import { Hash } from "lucide-react";
import Button from "../../components/ui/Button";
import Field from "../../components/ui/Field";
import FileDrop from "../../components/ui/FileDrop";
import TextArea from "../../components/ui/TextArea";
import Modal from "../../components/ui/Modal";
import { useState } from "react";

function CreateWorkspaceModal({ onClose }) {
  const [formData, setFormData] = useState({name: "", description: "", icon: null});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleFileChange = (file) => {
    setFormData((prev) => ({
      ...prev,
      icon: file,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Workspace name is required");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      console.log(formData);

      // API call هنا

      onClose();
    } catch (error) {
      setError("Failed to create workspace");
    } finally {
      setIsLoading(false);
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
            value={formData.name}
            onChange={handleChange}
          />

          <TextArea
            label="Description (optional)"
            placeholder="What's this workspace for?"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />

          <FileDrop
            label="Workspace icon (optional)"
            hint="Square image, up to 2MB"
            onFileChange={handleFileChange}
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