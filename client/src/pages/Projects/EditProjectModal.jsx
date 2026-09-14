import { useState } from "react";
import { Hash } from "lucide-react";
import Button from "../../components/ui/Button";
import Field from "../../components/ui/Field";
import TextArea from "../../components/ui/TextArea";
import Modal from "../../components/ui/Modal";
import { useProjectStore } from "../../store/useProjectStore";

function EditProjectModal({ project, onClose }) {
    const { updateProject, isUpdating } = useProjectStore();
    const [projectFormData, setProjectFormData] = useState({
        name: project.name || "",
        description: project.description || "",
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

    // Only fields the user actually changed are included in the PATCH body,
    // so the update stays a true partial update.
    const getChangedFields = () => {
        const changes = {};

        const trimmedName = projectFormData.name.trim();
        if (trimmedName !== (project.name || "")) {
            changes.name = trimmedName;
        }

        const trimmedDescription = projectFormData.description.trim();
        if (trimmedDescription !== (project.description || "")) {
            changes.description = trimmedDescription;
        }

        return changes;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const changes = getChangedFields();

        // Mirrors the endpoint's validation rule: name, if supplied, can't be empty.
        if (Object.prototype.hasOwnProperty.call(changes, "name") && !changes.name) {
            setError("Project name is required");
            return;
        }

        // Nothing changed, nothing to submit.
        if (Object.keys(changes).length === 0) {
            onClose();
            return;
        }

        try {
            await updateProject(project.id, changes);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update project");
        }
    };

    return (
        <Modal title="Edit project" onClose={onClose}>
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
                    <Button full type="submit" disabled={isUpdating}>
                        {isUpdating ? "Saving..." : "Save changes"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

export default EditProjectModal;
