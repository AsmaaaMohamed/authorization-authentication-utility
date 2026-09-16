import { useState } from "react";
import { useWorkspaceStore } from "../store";
import Button from "./ui/Button";
import Field from "./ui/Field";
import Modal from "./ui/Modal";
import Select from "./ui/Select";
import { Mail, Shield, Sparkles } from "lucide-react";
import { toast } from "react-toastify";
import { C, FONT } from "../constants/theme";

function InviteModal({ workspaceId, onClose, onInviteSent }) {
  const { inviteMember, isLoading, workspaces } = useWorkspaceStore();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("MEMBER");

  const currentWorkspace = workspaces.find((item) => (item.id || item._id) == workspaceId);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!workspaceId) {
      toast.error("Please choose a workspace before inviting a member.");
      return;
    }

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!["MEMBER", "ADMIN"].includes(role)) {
      toast.error("Role must be Member or Admin");
      return;
    }

    try {
      await inviteMember(workspaceId, { email: email.trim(), role });
      toast.success(`Invitation sent to ${currentWorkspace?.name || "this workspace"}.`);
      onInviteSent?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send invitation");
    } finally {
      setEmail("");
      setRole("MEMBER");
    }
  };

  return (
    <Modal title="Invite a member" onClose={onClose}>
      <div style={{ marginBottom: 18, display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, background: C.panel2, border: `1px solid ${C.border}` }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: `${C.accent}1a`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Sparkles size={16} color={C.accent} />
        </div>
        <div style={{ fontSize: 12.5, color: C.textMuted, lineHeight: 1.5, fontFamily: FONT }}>
          Invite someone to this workspace using the existing workspace invitation controller.
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Field
          label="Email"
          required
          icon={Mail}
          placeholder="teammate@example.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Select
          label="Role"
          required
          icon={Shield}
          options={[
            { label: "Member", value: "MEMBER" },
            { label: "Admin", value: "ADMIN" },
          ]}
          value={role}
          onChange={setRole}
        />

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