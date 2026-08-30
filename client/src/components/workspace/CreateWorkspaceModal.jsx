import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Field from "../ui/Field";
import TextArea from "../ui/TextArea";
import FileDrop from "../ui/FileDrop";
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

import { C, FONT, MONO } from "../../constants/theme";

export default function CreateWorkspaceModal({ onClose }) {
  return (
    <Modal title="New workspace" onClose={onClose}>
      <Field
        label="Workspace name"
        required
        icon={Hash}
        placeholder="e.g. Product Team"
      />
      <TextArea
        label="Description (optional)"
        placeholder="What's this workspace for?"
      />
      <FileDrop
        label="Workspace icon (optional)"
        hint="Square image, up to 2MB"
      />
      <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
        <Button variant="secondary" full onClick={onClose}>
          Cancel
        </Button>
        <Button full onClick={onClose}>
          Create workspace
        </Button>
      </div>
    </Modal>
  );
}
