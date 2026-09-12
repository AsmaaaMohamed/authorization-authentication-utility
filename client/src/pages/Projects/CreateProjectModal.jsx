import { useState } from "react";
import { Hash } from "lucide-react";
import Button from "../../components/ui/Button";
import Field from "../../components/ui/Field";
import TextArea from "../../components/ui/TextArea";
import Modal from "../../components/ui/Modal";
import { useProjectStore } from "../../store/useProjectStore";

function CreateProjectModal({ workspaceId, onClose }) {
  const { createProject, isLoading } = useProjectStore();
  const [projectFormData, setProjectFormData] = useState({
    name: "",
    description: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: name cannot be submitted empty.
    if (!projectFormData.name.trim()) {
      setError("Project name is required");
      return;
    }

    try {
      await createProject(workspaceId, {
        name: projectFormData.name.trim(),
        description: projectFormData.description.trim(),
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    }
  };

  return (
    <Modal title="New project" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <Field
          label="Project name"
          required
          icon={Hash}
          placeholder="e.g. Mobile App"
          name="name"
          value={projectFormData.name}
          onChange={handleChange}
        />
        <TextArea
          label="Description (optional)"
          placeholder="What's this project about?"
          name="description"
          value={projectFormData.description}
          onChange={handleChange}
        />
        {error && (
          <div style={{ color: "red", fontSize: 12, marginBottom: 12 }}>
            {error}
          </div>
        )}
        <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
          <Button variant="secondary" full type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button full type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create project"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateProjectModal;
