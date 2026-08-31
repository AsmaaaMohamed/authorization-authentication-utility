import { useState } from "react";
import Avatar from "../../components/ui/Avatar";
import Button from "../../components/ui/Button";
import InviteModal from "../../components/InviteModal";
import PageHeader from "../../components/PageHeader";
import { Plus } from "lucide-react";
import { C, MONO } from "../../constants/theme";

function MembersPage() {
  const [showInvite, setShowInvite] = useState(false);
  const members = [
    { name: "Ali Fouda", initials: "AF", email: "ali@example.com", role: "Owner" },
    { name: "Sara Adel", initials: "SA", email: "sara@example.com", role: "Admin" },
    { name: "Omar Nabil", initials: "ON", email: "omar@example.com", role: "Member" },
  ];
  return (
    <div>
      <PageHeader title="Members" subtitle="3 people in Product Team" action={<Button icon={Plus} onClick={() => setShowInvite(true)}>Invite</Button>} />
      <div style={{ padding: "20px 28px" }}>
        {members.map((m) => (
          <div key={m.email} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 4px", borderBottom: `1px solid ${C.borderSoft}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar initials={m.initials} size={32} />
              <div>
                <div style={{ fontSize: 13.5, color: C.text }}>{m.name}</div>
                <div style={{ fontSize: 12, color: C.textFaint }}>{m.email}</div>
              </div>
            </div>
            <span style={{ fontFamily: MONO, fontSize: 11, color: C.textMuted, background: C.panel2, padding: "3px 9px", borderRadius: 5, border: `1px solid ${C.border}` }}>{m.role}</span>
          </div>
        ))}
      </div>
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
    </div>
  );
}

export default MembersPage;