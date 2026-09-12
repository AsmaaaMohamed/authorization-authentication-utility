import {
  AlignLeft,
  CheckCircle2,
  ChevronDown,
  Circle,
  CircleDot,
  MessageSquare,
  Paperclip,
  Plus,
  Search,
  Trash2,
  User,
  X,
} from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { C, FONT, MONO, TAGS } from "../../constants/theme";
import Avatar from "../../components/ui/Avatar";
import Button from "../../components/ui/Button";
import CheckboxRow from "../../components/ui/CheckboxRow";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import Field from "../../components/ui/Field";
import FileDrop from "../../components/ui/FileDrop";
import Label from "../../components/ui/Label";
import Modal from "../../components/ui/Modal";
import TagChip from "../../components/ui/TagChip";
import TextArea from "../../components/ui/TextArea";
import api from "../../services/api";

const STATUS_COLUMNS = [
  { id: "todo", title: "To Do", icon: Circle },
  { id: "in_progress", title: "In Progress", icon: CircleDot },
  { id: "done", title: "Done", icon: CheckCircle2 },
];

const emptyForm = { title: "", description: "", status: "todo", assigneeId: "" };

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "??";

const groupTasks = (tasks) =>
  STATUS_COLUMNS.map((column) => ({
    ...column,
    tasks: tasks.filter((task) => task.status === column.id),
  }));

const normalizeTask = (task, members) => ({
  ...task,
  tags: Array.isArray(task.tags) ? task.tags : [],
  attachments: Array.isArray(task.attachments) ? task.attachments : [],
  assignee: getInitials(
    members.find((member) => member.userId === task.assigneeId)?.name,
  ),
  comments: 0,
  files: task.attachments?.length || 0,
});

function TaskCard({ task }) {
  const setTask = useContext(TaskCtx);
  const [hover, setHover] = useState(false);

  return (
    <div
      onClick={() => setTask(task)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: C.panel,
        border: `1px solid ${hover ? C.accentDim : C.border}`,
        borderRadius: 8,
        padding: "12px 13px",
        marginBottom: 10,
        cursor: "pointer",
        transition: "border-color .15s, transform .15s",
        transform: hover ? "translateY(-1px)" : "none",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontFamily: MONO, fontSize: 11, color: C.textFaint }}>
          {task.id}
        </span>
        <div style={{ display: "flex", gap: 5 }}>
          {task.tags.map((tag) => <TagChip key={tag} tagKey={tag} />)}
        </div>
      </div>
      <div style={{ fontSize: 13.5, color: C.text, lineHeight: 1.4, marginBottom: 12 }}>
        {task.title}
      </div>
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
  const dot = column.id === "done" ? C.accent : column.id === "in_progress" ? C.amber : C.textFaint;

  return (
    <div style={{ flex: 1, minWidth: 270 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon size={13} color={dot} />
          <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: 0.4, color: C.textMuted, textTransform: "uppercase" }}>{column.title}</span>
          <span style={{ fontFamily: MONO, fontSize: 11, color: C.textFaint }}>{column.tasks.length}</span>
        </div>
        <Plus size={14} color={C.textFaint} style={{ cursor: "pointer" }} onClick={() => onAdd(column.id)} />
      </div>
      {column.tasks.map((task) => <TaskCard key={task.id} task={task} />)}
    </div>
  );
}

function TaskForm({ task, members, projectId, boardId, initialStatus, onClose, onSaved }) {
  const [form, setForm] = useState(task ? {
    title: task.title,
    description: task.description || "",
    status: task.status,
    assigneeId: task.assigneeId || "",
  } : { ...emptyForm, status: initialStatus || "todo" });
  const [files, setFiles] = useState([]);
  const [checked, setChecked] = useState(
    Object.fromEntries((task?.tags || []).map((tag) => [tag, true])),
  );
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = Boolean(task);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = "Title is required";
    if (!form.assigneeId) nextErrors.assigneeId = "Assignee is required";
    if (!["todo", "in_progress", "done"].includes(form.status)) nextErrors.status = "Choose a valid status";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      let attachments = task?.attachments || [];
      if (!isEditing) {
        attachments = [];
        for (const file of files) {
          const data = new FormData();
          data.append("image", file);
          const response = await api.post("/upload/upload", data);
          const url = response.data?.data?.secure_url;
          if (!url) throw new Error("Upload response did not include an image URL");
          attachments.push(url);
        }
      }

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
        ...(isEditing ? {} : { projectId, boardId }),
        assigneeId: form.assigneeId,
        tags: Object.keys(checked).filter((tag) => checked[tag]),
        attachments,
      };
      const response = isEditing
        ? await api.patch(`/tasks/${task.id}`, payload)
        : await api.post("/tasks", payload);
      onSaved(response.data?.data, payload);
      toast.success(isEditing ? "Task updated successfully" : "Task created successfully");
      onClose();
    } catch (error) {
      const message = getErrorMessage(error, isEditing ? "Failed to update task" : "Failed to create task");
      setErrors({ form: message });
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title={isEditing ? "Edit task" : "New task"} onClose={onClose} width={480}>
      <form onSubmit={submit}>
        <Field label="Title" name="title" required icon={AlignLeft} placeholder="Task title" value={form.title} onChange={updateField} />
        {errors.title && <div style={{ color: C.red, fontSize: 12, marginTop: -10, marginBottom: 12 }}>{errors.title}</div>}
        <TextArea label="Description" name="description" placeholder="What needs to be done?" rows={4} value={form.description} onChange={updateField} />
        <div style={{ marginBottom: 16 }}>
          <Label required>Status</Label>
          <select name="status" value={form.status} onChange={updateField} style={selectStyle}>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          {errors.status && <div style={errorStyle}>{errors.status}</div>}
        </div>
        <div style={{ marginBottom: 16 }}>
          <Label required>Assignee</Label>
          <select name="assigneeId" value={form.assigneeId} onChange={updateField} style={selectStyle}>
            <option value="">Select an assignee</option>
            {members.map((member) => <option key={member.userId} value={member.userId}>{member.name}</option>)}
          </select>
          {errors.assigneeId && <div style={errorStyle}>{errors.assigneeId}</div>}
        </div>
        <div style={{ marginBottom: 16 }}>
          <Label>Tags</Label>
          {Object.keys(TAGS).map((tag) => <CheckboxRow key={tag} tagKey={tag} checked={Boolean(checked[tag])} onToggle={() => setChecked((current) => ({ ...current, [tag]: !current[tag] }))} />)}
        </div>
        {!isEditing && <FileDrop label="Attachments (optional)" hint="JPEG, PNG, WEBP, or GIF; up to 5MB each" multiple files={files} onChange={(event) => setFiles(Array.from(event.target.files || []))} />}
        {errors.form && <div style={{ color: C.red, fontSize: 12, marginBottom: 12 }}>{errors.form}</div>}
        <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
          <Button variant="secondary" full onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button full type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : isEditing ? "Save changes" : "Create task"}</Button>
        </div>
      </form>
    </Modal>
  );
}

function TaskPanel({ task, onClose, onEdit, onDelete }) {
  if (!task) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000AA", display: "flex", justifyContent: "flex-end", zIndex: 50 }} onClick={onClose}>
      <div onClick={(event) => event.stopPropagation()} style={{ width: 420, maxWidth: "90vw", height: "100%", background: C.panel, borderLeft: `1px solid ${C.border}`, padding: "22px 22px 0", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 12, color: C.textFaint, marginBottom: 6 }}>{task.id}</div>
            <div style={{ fontSize: 17, color: C.text, fontWeight: 500, lineHeight: 1.35 }}>{task.title}</div>
          </div>
          <X size={18} color={C.textMuted} style={{ cursor: "pointer" }} onClick={onClose} />
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {task.tags.map((tag) => <TagChip key={tag} tagKey={tag} />)}
        </div>
        <div style={{ flex: 1, overflowY: "auto", color: C.textMuted, fontSize: 13, lineHeight: 1.5 }}>
          {task.description || "No description"}
        </div>
        <div style={{ display: "flex", gap: 10, padding: "14px 0 18px", borderTop: `1px solid ${C.borderSoft}` }}>
          <Button full icon={User} onClick={onEdit}>Edit task</Button>
          <Button variant="danger" icon={Trash2} onClick={onDelete}>Delete</Button>
        </div>
      </div>
    </div>
  );
}

const selectStyle = {
  width: "100%",
  background: C.panel2,
  color: C.text,
  border: `1px solid ${C.border}`,
  borderRadius: 8,
  padding: "10px 12px",
  fontFamily: FONT,
};
const errorStyle = { color: C.red, fontSize: 12, marginTop: 6 };
const TaskCtx = createContext(() => {});

function BoardPage() {
  const { projectId, boardId, workspaceId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [createStatus, setCreateStatus] = useState("todo");
  const [isLoading, setIsLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const allTasks = [];
      let page = 1;
      let totalPages = 1;
      do {
        const response = await api.get(`/tasks/boards/${boardId}`, { params: { limit: 100, page } });
        allTasks.push(...(response.data?.data || []));
        totalPages = response.data?.totalPages || 1;
        page += 1;
      } while (page <= totalPages);
      setTasks(allTasks);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load tasks"));
    } finally {
      setIsLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    // Loading remote board data is the synchronization this effect performs.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    api.get(`/workspace/${workspaceId}/members`)
      .then((response) => setMembers(response.data?.data?.members || []))
      .catch((error) => toast.error(getErrorMessage(error, "Failed to load assignees")));
  }, [workspaceId]);

  const saveTask = (savedTask, payload) => {
    const normalized = normalizeTask({ ...savedTask, ...payload }, members);
    setTasks((current) => editingTask
      ? current.map((task) => task.id === normalized.id ? normalized : task)
      : [normalized, ...current]);
    setActiveTask(null);
    setEditingTask(null);
  };

  const deleteTask = async () => {
    try {
      await api.delete(`/tasks/${deletingTask.id}`);
      setTasks((current) => current.filter((task) => task.id !== deletingTask.id));
      setActiveTask(null);
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete task"));
    } finally {
      setDeletingTask(null);
    }
  };

  const normalizedTasks = tasks.map((task) => normalizeTask(task, members));

  return (
    <TaskCtx.Provider value={setActiveTask}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: C.textMuted }}>
          <span>Product Team</span><span style={{ color: C.textFaint }}>/</span><span style={{ color: C.text }}>Board</span><ChevronDown size={13} color={C.textFaint} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, background: C.panel, border: `1px solid ${C.border}`, borderRadius: 7, padding: "6px 10px" }}>
            <Search size={13} color={C.textFaint} /><span style={{ fontSize: 12.5, color: C.textFaint }}>Search tasks…</span>
          </div>
          <Button icon={Plus} onClick={() => { setCreateStatus("todo"); setEditingTask({}); }}>New task</Button>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", gap: 20, padding: "20px 24px", overflowX: "auto" }}>
        {isLoading ? <div style={{ color: C.textMuted }}>Loading tasks…</div> : groupTasks(normalizedTasks).map((column) => <Column key={column.id} column={column} onAdd={(status) => { setCreateStatus(status); setEditingTask({}); }} />)}
      </div>
      <TaskPanel task={activeTask} onClose={() => setActiveTask(null)} onEdit={() => { setEditingTask(activeTask); setActiveTask(null); }} onDelete={() => setDeletingTask(activeTask)} />
      {editingTask && <TaskForm task={editingTask.id ? editingTask : null} projectId={projectId} boardId={boardId} initialStatus={createStatus} members={members} onSaved={saveTask} onClose={() => setEditingTask(null)} />}
      {deletingTask && <ConfirmationModal title="Delete task?" message={`Delete "${deletingTask.title}"? This cannot be undone.`} confirmText="Delete" onCancel={() => setDeletingTask(null)} onConfirm={deleteTask} />}
    </TaskCtx.Provider>
  );
}

export default BoardPage;
