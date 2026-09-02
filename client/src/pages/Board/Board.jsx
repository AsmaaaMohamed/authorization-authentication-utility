import { AlignLeft, CheckCircle2, ChevronDown, Circle, CircleDot, Flag, MessageSquare, Paperclip, Plus, Search, User, X, } from "lucide-react";
import { createContext, useContext, useState } from "react";
import { C, FONT, MONO, TAGS } from "../../constants/theme";
import Avatar from "../../components/ui/Avatar";
import Label from "../../components/ui/Label";
import Modal from "../../components/ui/Modal";
import Field from "../../components/ui/Field";
import TextArea from "../../components/ui/TextArea";
import Select from "../../components/ui/Select";
import FileDrop from "../../components/ui/FileDrop";
import Button from "../../components/ui/Button";
import TagChip from "../../components/ui/TagChip";
import CheckboxRow from "../../components/ui/CheckboxRow";

const initialColumns = [
  { id: "todo", title: "To Do", icon: Circle, tasks: [
    { id: "TSK-101", title: "Set up JWT refresh rotation", tags: ["backend"], assignee: "AF", comments: 3, files: 1 },
    { id: "TSK-104", title: "Design login screen states", tags: ["design"], assignee: "SA", comments: 1, files: 2 },
    { id: "TSK-108", title: "Rate limiter for OTP requests", tags: ["backend", "urgent"], assignee: "AF", comments: 0, files: 0 },
  ]},
  { id: "progress", title: "In Progress", icon: CircleDot, tasks: [
    { id: "TSK-097", title: "Cloudinary avatar upload pipeline", tags: ["backend"], assignee: "AF", comments: 5, files: 3 },
    { id: "TSK-102", title: "Workspace invite email template", tags: ["design"], assignee: "SA", comments: 2, files: 1 },
  ]},
  { id: "done", title: "Done", icon: CheckCircle2, tasks: [
    { id: "TSK-089", title: "OTP password reset flow", tags: ["backend"], assignee: "AF", comments: 8, files: 0 },
    { id: "TSK-091", title: "Auth middleware + RBAC guard", tags: ["backend"], assignee: "AF", comments: 4, files: 1 },
  ]},
];

const MOCK_COMMENTS = [
  { id: 1, user: "Sara Adel", initials: "SA", body: "Should this block by IP or by email+IP combo?", time: "2h ago" },
  { id: 2, user: "Ali Fouda", initials: "AF", body: "Both — key on email+IP, fall back to IP-only after 3 fails.", time: "1h ago" },
];

const TaskCtx = createContext(() => {});

function TaskCard({ task }) {
  const setTask = useContext(TaskCtx);
  const [hover, setHover] = useState(false);
  return (
    <div onClick={() => setTask(task)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ background: C.panel, border: `1px solid ${hover ? C.accentDim : C.border}`, borderRadius: 8, padding: "12px 13px", marginBottom: 10, cursor: "pointer", transition: "border-color .15s, transform .15s", transform: hover ? "translateY(-1px)" : "none" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontFamily: MONO, fontSize: 11, color: C.textFaint }}>{task.id}</span>
        <div style={{ display: "flex", gap: 5 }}>{task.tags.map((t) => <TagChip key={t} tagKey={t} />)}</div>
      </div>
      <div style={{ fontSize: 13.5, color: C.text, lineHeight: 1.4, marginBottom: 12 }}>{task.title}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Avatar initials={task.assignee} />
        <div style={{ display: "flex", gap: 12, color: C.textFaint, fontSize: 11.5 }}>
          {task.files > 0 && <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Paperclip size={12} /> {task.files}</span>}
          <span style={{ display: "flex", alignItems: "center", gap: 3 }}><MessageSquare size={12} /> {task.comments}</span>
        </div>
      </div>
    </div>
  );
}

function Column({ column, onAdd }) {
  const Icon = column.icon;
  const dot = column.id === "done" ? C.accent : column.id === "progress" ? C.amber : C.textFaint;
  return (
    <div style={{ flex: 1, minWidth: 270 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon size={13} color={dot} />
          <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: 0.4, color: C.textMuted, textTransform: "uppercase" }}>{column.title}</span>
          <span style={{ fontFamily: MONO, fontSize: 11, color: C.textFaint }}>{column.tasks.length}</span>
        </div>
        <Plus size={14} color={C.textFaint} style={{ cursor: "pointer" }} onClick={onAdd} />
      </div>
      {column.tasks.map((t) => <TaskCard key={t.id} task={t} />)}
    </div>
  );
}

function TaskPanel({ task, onClose }) {
  if (!task) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000AA", display: "flex", justifyContent: "flex-end", zIndex: 50 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 420, maxWidth: "90vw", height: "100%", background: C.panel, borderLeft: `1px solid ${C.border}`, padding: "22px 22px 0", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 12, color: C.textFaint, marginBottom: 6 }}>{task.id}</div>
            <div style={{ fontSize: 17, color: C.text, fontWeight: 500, lineHeight: 1.35 }}>{task.title}</div>
          </div>
          <X size={18} color={C.textMuted} style={{ cursor: "pointer" }} onClick={onClose} />
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>{task.tags.map((t) => <TagChip key={t} tagKey={t} />)}</div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {MOCK_COMMENTS.map((c) => (
            <div key={c.id} style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <Avatar initials={c.initials} size={24} />
              <div>
                <div style={{ display: "flex", gap: 8, alignItems: "baseline", marginBottom: 3 }}>
                  <span style={{ fontSize: 12.5, color: C.text, fontWeight: 500 }}>{c.user}</span>
                  <span style={{ fontSize: 11, color: C.textFaint }}>{c.time}</span>
                </div>
                <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.5 }}>{c.body}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "14px 0 18px", borderTop: `1px solid ${C.borderSoft}` }}>
          <Label required>Comment</Label>
          <input placeholder="Write a comment…" style={{ width: "100%", background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 7, padding: "9px 12px", fontSize: 13, color: C.text, outline: "none", fontFamily: FONT }} />
        </div>
      </div>
    </div>
  );
}

function CreateTaskModal({ onClose }) {
  const [checked, setChecked] = useState({ backend: true, design: false, urgent: false });
  const toggle = (k) => setChecked((c) => ({ ...c, [k]: !c[k] }));
  return (
    <Modal title="New task" onClose={onClose} width={480}>
      <Field label="Title" required icon={AlignLeft} placeholder="e.g. Add refresh-token rotation" />
      <TextArea label="Description" placeholder="What needs to be done?" rows={4} />
      <Select label="Status" required icon={Flag} options={["To Do", "In Progress", "Done"]} />
      <Select label="Assignee" required icon={User} options={["Ali Fouda", "Sara Adel", "Omar Nabil"]} />
      <div style={{ marginBottom: 16 }}>
        <Label>Tags</Label>
        {Object.keys(TAGS).map((k) => <CheckboxRow key={k} tagKey={k} checked={checked[k]} onToggle={() => toggle(k)} />)}
      </div>
      <FileDrop label="Attachments (optional)" hint="Up to 10 files, 5MB each" />
      <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
        <Button variant="secondary" full onClick={onClose}>Cancel</Button>
        <Button full onClick={onClose}>Create task</Button>
      </div>
    </Modal>
  );
}

function BoardPage() {
  const [activeTask, setActiveTask] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  return (
    <TaskCtx.Provider value={setActiveTask}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: C.textMuted }}>
          <span>Product Team</span><span style={{ color: C.textFaint }}>/</span><span style={{ color: C.text }}>Sprint 1</span>
          <ChevronDown size={13} color={C.textFaint} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, background: C.panel, border: `1px solid ${C.border}`, borderRadius: 7, padding: "6px 10px" }}>
            <Search size={13} color={C.textFaint} /><span style={{ fontSize: 12.5, color: C.textFaint }}>Search tasks…</span>
          </div>
          <Button icon={Plus} onClick={() => setShowCreate(true)}>New task</Button>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", gap: 20, padding: "20px 24px", overflowX: "auto" }}>
        {initialColumns.map((col) => <Column key={col.id} column={col} onAdd={() => setShowCreate(true)} />)}
      </div>
      <TaskPanel task={activeTask} onClose={() => setActiveTask(null)} />
      {showCreate && <CreateTaskModal onClose={() => setShowCreate(false)} />}
    </TaskCtx.Provider>
  );
}

export default BoardPage;