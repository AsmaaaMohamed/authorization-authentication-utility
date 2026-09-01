import { useState } from "react";
import { useWorkspaceStore } from "../store/useWorkspaceStore";
import Button from "./ui/Button";
import Field from "./ui/Field";
import Modal from "./ui/Modal";
import Select from "./ui/Select";
import { Mail, Shield } from "lucide-react";
import { toast } from "react-toastify";

function InviteModal({ workspaceId, onClose }) {
   const { inviteMember, isLoading } = useWorkspaceStore();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");
  const [error, setError] = useState("");
// console.log("workspaceId in InviteModal:", workspaceId); // Log the workspaceId to verify it's being passed correctly
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!["Member", "Admin"].includes(role)) {
      setError("Role must be Member or Admin");
      return;
    }

    try {
      await inviteMember(workspaceId, { email, role });
      toast.success("Invitation sent successfully!");
      onClose();
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to send invitation"
      );
    }
  };
  return (
    <Modal title="Invite a member" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <Field label="Email" required icon={Mail} placeholder="teammate@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        <Select label="Role" required icon={Shield} options={["Member", "Admin"]} />
        <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
          <Button variant="secondary" full onClick={onClose}>Cancel</Button>
          <Button full type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send invite"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default InviteModal;