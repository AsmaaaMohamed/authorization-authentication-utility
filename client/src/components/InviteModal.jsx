import Button from "./ui/Button";
import Field from "./ui/Field";
import Modal from "./ui/Modal";
import Select from "./ui/Select";
import { Mail, Shield } from "lucide-react";

function InviteModal({ onClose }) {
  return (
    <Modal title="Invite a member" onClose={onClose}>
      <Field label="Email" required icon={Mail} placeholder="teammate@example.com" />
      <Select label="Role" required icon={Shield} options={["Member", "Admin"]} />
      <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
        <Button variant="secondary" full onClick={onClose}>Cancel</Button>
        <Button full onClick={onClose}>Send invite</Button>
      </div>
    </Modal>
  );
}

export default InviteModal;