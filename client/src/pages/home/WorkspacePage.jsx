import { useState } from "react";
import Button from "../../components/ui/Button";
import { C, FONT, MONO } from "../../constants/theme";
import CreateWorkspaceModal from "../../components/workspace/CreateWorkspaceModal";

import {
  Hash,
  Search,
  Plus,
  MessageSquare,
  Paperclip,
  ChevronDown,
  ChevronRight,
  Circle,
  CheckCircle2,
  CircleDot,
  X,
  LayoutGrid,
  Users,
  Settings as SettingsIcon,
  Bell,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Trash2,
  Shield,
  LogOut,
  Clock,
  AtSign,
  UploadCloud,
  Tag as TagIcon,
  AlignLeft,
  Flag,
  ChevronsUpDown,
} from "lucide-react";

export default function WorkspacesPage() {
  const [showCreate, setShowCreate] = useState(false);
  const workspaces = [
    { name: "Product Team", role: "Owner", members: 6, projects: 3 },
    { name: "Backend Utils", role: "Admin", members: 4, projects: 1 },
    { name: "Freelance Clients", role: "Member", members: 2, projects: 5 },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        fontFamily: FONT,
        padding: "40px 28px",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 20,
                color: C.text,
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              Your workspaces
            </div>
            <div style={{ fontSize: 13, color: C.textFaint }}>
              Pick one to continue, or start a new one.
            </div>
          </div>
          <Button icon={Plus} onClick={() => setShowCreate(true)}>
            New workspace
          </Button>
        </div>
        {workspaces.map((w) => (
          <div
            key={w.name}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: C.panel,
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              padding: "16px 18px",
              marginBottom: 10,
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: C.panel2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: MONO,
                  fontSize: 14,
                  color: C.accent,
                }}
              >
                {w.name[0]}
              </div>
              <div>
                <div style={{ fontSize: 14, color: C.text, fontWeight: 500 }}>
                  {w.name}
                </div>
                <div style={{ fontSize: 12, color: C.textFaint }}>
                  {w.members} members · {w.projects} projects
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 11,
                  color: C.textMuted,
                  background: C.panel2,
                  padding: "3px 8px",
                  borderRadius: 5,
                  border: `1px solid ${C.border}`,
                }}
              >
                {w.role}
              </span>
              <ChevronRight size={15} color={C.textFaint} />
            </div>
          </div>
        ))}
      </div>
      {showCreate && (
        <CreateWorkspaceModal onClose={() => setShowCreate(false)} />
      )}
    </div>
  );
}
