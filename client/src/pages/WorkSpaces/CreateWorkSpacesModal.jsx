import { Hash } from "lucide-react";
import Button from "../../components/ui/Button";
import Field from "../../components/ui/Field";
import FileDrop from "../../components/ui/FileDrop";
import TextArea from "../../components/ui/TextArea";
import Modal from "../../components/ui/Modal";

function CreateWorkspaceModal({ onClose }) {
  return (
    <Modal title="New workspace" onClose={onClose}>
      <Field label="Workspace name" required icon={Hash} placeholder="e.g. Product Team" />
      <TextArea label="Description (optional)" placeholder="What's this workspace for?" />
      <FileDrop label="Workspace icon (optional)" hint="Square image, up to 2MB" />
      <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
        <Button variant="secondary" full onClick={onClose}>Cancel</Button>
        <Button full onClick={onClose}>Create workspace</Button>
      </div>
    </Modal>
  );
}

export default CreateWorkspaceModal;