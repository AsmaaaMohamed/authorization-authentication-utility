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

const PRIORITY_META = {
  highest: { label: "Highest", color: C.red },
  high: { label: "High", color: C.red },
  medium: { label: "Medium", color: C.amber },
  low: { label: "Low", color: C.accent },
  lowest: { label: "Lowest", color: C.textFaint },
};

const groupTasks = (tasks) =>
  STATUS_COLUMNS.map((column) => ({
    ...column,
    tasks: tasks.filter((task) => task.status === column.id),
  }));

const normalizeTask = (task, members) => {
  const assigneeMember = members.find(
    (member) => member.userId?.toString() === task.assigneeId?.toString(),
  );

  return {
    ...task,
    tags: Array.isArray(task.tags) ? task.tags : [],
    attachments: Array.isArray(task.attachments) ? task.attachments : [],
    assigneeName: assigneeMember?.name || "Unassigned",
    assignee: getInitials(assigneeMember?.name),
    comments: 0,
    files: task.attachments?.length || 0,
    priority: task.priority || "medium",
    type: task.type || "task",
  };
};

function TaskCard({ task, onOpen, onDragStart, onDragEnd }) {
  const setTask = useContext(TaskCtx);
  const [hover, setHover] = useState(false);
  const priority = PRIORITY_META[task.priority] || PRIORITY_META.medium;

  return (
    <div
      draggable
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", task.id);
        onDragStart(task.id);
      }}
      onDragEnd={onDragEnd}
      onClick={() => setTask(task)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: C.panel,
        border: `1px solid ${hover ? C.accentDim : C.border}`,
        borderRadius: 12,
        padding: "12px 12px 10px",
        marginBottom: 10,
        cursor: "pointer",
        boxShadow: hover ? `0 8px 18px ${C.shadow}` : "none",
        transition: "all 150ms ease",
        transform: hover ? "translateY(-1px)" : "none",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontFamily: MONO, fontSize: 11, color: C.textFaint, letterSpacing: 0.3 }}>
          {task.id}
        </span>
        <span
          style={{
            fontFamily: MONO,
            fontSize: 10,
            color: priority.color,
            background: `${priority.color}22`,
            border: `1px solid ${priority.color}44`,
            borderRadius: 999,
            padding: "4px 7px",
            textTransform: "uppercase",
            letterSpacing: 0.25,
          }}
        >
          {priority.label}
        </span>
      </div>

      <div style={{ fontSize: 13.5, color: C.text, lineHeight: 1.45, marginBottom: 10 }}>
        {task.title}
      </div>

      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 12 }}>
        {task.tags.slice(0, 2).map((tag) => (
          <TagChip key={tag} tagKey={tag} />
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar initials={task.assignee} size={24} />
          <div style={{ fontSize: 11.5, color: C.textMuted }}>{task.assigneeName}</div>
        </div>
        <div style={{ display: "flex", gap: 10, color: C.textFaint, fontSize: 11.5 }}>
          {task.files > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Paperclip size={12} /> {task.files}
            </span>
          )}
          <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <MessageSquare size={12} /> {task.comments}
          </span>
        </div>
      </div>
    </div>
  );
}

function Column({ column, tasks, onAdd, onDrop, onDragOver, onDragLeave, isActive, onDragStart, onDragEnd }) {
  const Icon = column.icon;
  const dot = column.id === "done" ? C.accent : column.id === "in_progress" ? C.amber : C.textFaint;

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        onDragOver(column.id);
      }}
      onDragLeave={() => onDragLeave(column.id)}
      onDrop={(event) => {
        event.preventDefault();
        onDrop(column.id, event.dataTransfer.getData("text/plain"));
      }}
      style={{
        flex: 1,
        minWidth: 280,
        background: isActive ? `${C.accent}0d` : C.bg,
        border: `1px solid ${isActive ? C.accent : C.border}`,
        borderRadius: 16,
        padding: 12,
        transition: "all 150ms ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon size={13} color={dot} />
          <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: 0.4, color: C.textMuted, textTransform: "uppercase" }}>{column.title}</span>
          <span style={{ fontFamily: MONO, fontSize: 11, color: C.textFaint }}>{tasks.length}</span>
        </div>
        <button
          type="button"
          onClick={() => onAdd(column.id)}
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            border: `1px solid ${C.border}`,
            background: C.panel,
            color: C.textMuted,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          aria-label={`Create task in ${column.title}`}
        >
          <Plus size={14} />
        </button>
      </div>

      <div style={{ minHeight: 200 }}>
        {tasks.length === 0 ? (
          <div
            style={{
              border: `1px dashed ${C.border}`,
              borderRadius: 10,
              padding: "18px 12px",
              textAlign: "center",
              color: C.textFaint,
              fontSize: 12,
              background: "transparent",
            }}
          >
            Drop task here
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))
        )}
      </div>
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

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function TaskPanel({
  task,
  members,
  comments = [],
  commentDraft,
  onCommentDraftChange,
  onCommentSubmit,
  isCommenting,
  onClose,
  onEdit,
  onDelete,
}) {
  if (!task) return null;

  const assignee = members.find(
    (member) => member.userId?.toString() === task.assigneeId?.toString(),
  );
  const statusMeta = STATUS_COLUMNS.find((column) => column.id === task.status) || STATUS_COLUMNS[0];
  const priorityMeta = PRIORITY_META[task.priority] || PRIORITY_META.medium;

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000AA", display: "flex", justifyContent: "flex-end", zIndex: 50 }} onClick={onClose}>
      <div onClick={(event) => event.stopPropagation()} style={{ width: 440, maxWidth: "90vw", height: "100%", background: C.panel, borderLeft: `1px solid ${C.border}`, padding: "22px 22px 0", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 12, color: C.textFaint, marginBottom: 6 }}>{task.id}</div>
            <div style={{ fontSize: 17, color: C.text, fontWeight: 500, lineHeight: 1.35 }}>{task.title}</div>
          </div>
          <X size={18} color={C.textMuted} style={{ cursor: "pointer" }} onClick={onClose} />
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
          {task.tags.map((tag) => <TagChip key={tag} tagKey={tag} />)}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12, marginBottom: 18 }}>
          <div style={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 10, padding: 10 }}>
            <div style={{ fontSize: 11, color: C.textFaint, marginBottom: 5 }}>Assignee</div>
            <div style={{ fontSize: 13, color: C.text }}>{assignee?.name || "Unassigned"}</div>
          </div>
          <div style={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 10, padding: 10 }}>
            <div style={{ fontSize: 11, color: C.textFaint, marginBottom: 5 }}>Status</div>
            <div style={{ fontSize: 13, color: C.text }}>{statusMeta.title}</div>
          </div>
          <div style={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 10, padding: 10 }}>
            <div style={{ fontSize: 11, color: C.textFaint, marginBottom: 5 }}>Priority</div>
            <div style={{ fontSize: 13, color: priorityMeta.color }}>{priorityMeta.label}</div>
          </div>
          <div style={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 10, padding: 10 }}>
            <div style={{ fontSize: 11, color: C.textFaint, marginBottom: 5 }}>Updated</div>
            <div style={{ fontSize: 13, color: C.text }}>{formatDate(task.updatedAt || task.createdAt)}</div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", paddingRight: 4 }}>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, color: C.textFaint, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 }}>Description</div>
            <div style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.6 }}>
              {task.description || "No description"}
            </div>
          </div>

          {task.attachments?.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 12, color: C.textFaint, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 }}>Attachments</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {task.attachments.map((attachment, index) => (
                  <a
                    key={`${attachment}-${index}`}
                    href={attachment}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: C.accent, fontSize: 12, wordBreak: "break-word" }}
                  >
                    {attachment}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div>
            <div style={{ fontSize: 12, color: C.textFaint, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.4 }}>Comments</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {comments.length === 0 ? (
                <div style={{ color: C.textFaint, fontSize: 12 }}>No comments yet.</div>
              ) : (
                comments.map((comment) => {
                  const commentUser = members.find((member) => member.userId?.toString() === comment.userId?.toString());
                  return (
                    <div key={comment.id || comment._id} style={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 10, padding: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                        <div style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>{commentUser?.name || "Member"}</div>
                        <div style={{ fontSize: 11, color: C.textFaint }}>{formatDate(comment.createdAt)}</div>
                      </div>
                      <div style={{ fontSize: 12.5, color: C.textMuted, lineHeight: 1.5 }}>{comment.body}</div>
                    </div>
                  );
                })
              )}
            </div>

            <div style={{ marginTop: 16 }}>
              <textarea
                value={commentDraft}
                onChange={onCommentDraftChange}
                placeholder="Write a comment..."
                style={{
                  width: "100%",
                  minHeight: 80,
                  background: C.panel2,
                  color: C.text,
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                  padding: "10px 12px",
                  resize: "vertical",
                  fontFamily: FONT,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                <Button onClick={onCommentSubmit} disabled={isCommenting || !commentDraft.trim()}>
                  {isCommenting ? "Posting..." : "Post comment"}
                </Button>
              </div>
            </div>
          </div>
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
  const [taskComments, setTaskComments] = useState([]);
  const [commentDraft, setCommentDraft] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [createStatus, setCreateStatus] = useState("todo");
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverStatus, setDragOverStatus] = useState(null);
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
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    if (!activeTask?.id) {
      setTaskComments([]);
      setCommentDraft("");
      return;
    }

    let isCancelled = false;

    const fetchComments = async () => {
      try {
        const response = await api.get(`/tasks/${activeTask.id}/comments`);
        if (!isCancelled) {
          setTaskComments(Array.isArray(response.data?.data) ? response.data.data : []);
        }
      } catch (error) {
        if (!isCancelled) {
          setTaskComments([]);
        }
      }
    };

    fetchComments();
    return () => {
      isCancelled = true;
    };
  }, [activeTask?.id]);

  useEffect(() => {
    api.get(`/workspace/${workspaceId}/members`)
      .then((response) => setMembers(response.data?.data?.members || []))
      .catch((error) => toast.error(getErrorMessage(error, "Failed to load assignees")));
  }, [workspaceId]);

  const saveTask = (savedTask, payload) => {
    const normalized = normalizeTask({ ...savedTask, ...payload }, members);
    setTasks((current) => (editingTask?.id
      ? current.map((task) => (task.id === normalized.id ? normalized : task))
      : [normalized, ...current]));
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

  const moveTaskToStatus = useCallback(async (taskId, nextStatus) => {
    const previousTask = tasks.find((task) => task.id === taskId);
    if (!previousTask || previousTask.status === nextStatus) return;

    const previousStatus = previousTask.status;

    setTasks((current) =>
      current.map((task) => (task.id === taskId ? { ...task, status: nextStatus } : task)),
    );

    try {
      await api.patch(`/tasks/${taskId}`, { status: nextStatus });
      toast.success("Task moved successfully");
    } catch (error) {
      setTasks((current) =>
        current.map((task) => (task.id === taskId ? { ...task, status: previousStatus } : task)),
      );
      toast.error(getErrorMessage(error, "Failed to move task"));
    } finally {
      setDraggedTaskId(null);
      setDragOverStatus(null);
    }
  }, [tasks]);

  const handleCommentSubmit = async () => {
    if (!activeTask?.id || !commentDraft.trim()) return;

    setIsCommenting(true);
    try {
      const response = await api.post(`/tasks/${activeTask.id}/comments`, {
        body: commentDraft.trim(),
      });
      const comment = response.data?.data || response.data;
      setTaskComments((current) => [comment, ...current]);
      setCommentDraft("");
      toast.success("Comment added");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to add comment"));
    } finally {
      setIsCommenting(false);
    }
  };

  const normalizedTasks = tasks.map((task) => normalizeTask(task, members));
  const boardStats = [
    { label: "Total tasks", value: normalizedTasks.length, color: C.text },
    { label: "To do", value: normalizedTasks.filter((task) => task.status === "todo").length, color: C.textFaint },
    { label: "In progress", value: normalizedTasks.filter((task) => task.status === "in_progress").length, color: C.amber },
    { label: "Done", value: normalizedTasks.filter((task) => task.status === "done").length, color: C.accent },
  ];

  return (
    <TaskCtx.Provider value={setActiveTask}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: C.textMuted }}>
          <span>Product Team</span><span style={{ color: C.textFaint }}>/</span><span style={{ color: C.text }}>Board</span><ChevronDown size={13} color={C.textFaint} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, background: C.panel, border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 12px", minWidth: 180 }}>
            <Search size={13} color={C.textFaint} />
            <span style={{ fontSize: 12.5, color: C.textFaint }}>Search tasks…</span>
          </div>
          <Button icon={Plus} onClick={() => { setCreateStatus("todo"); setEditingTask({}); }}>New task</Button>
        </div>
      </div>

      <div style={{ padding: "18px 24px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
          {boardStats.map((stat) => (
            <div key={stat.label} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 11, color: C.textFaint, marginBottom: 8 }}>{stat.label}</div>
              <div style={{ fontSize: 24, color: stat.color, fontWeight: 700 }}>{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", gap: 20, padding: "20px 24px", overflowX: "auto" }}>
        {isLoading ? (
          <div style={{ color: C.textMuted, paddingTop: 18 }}>Loading tasks…</div>
        ) : (
          groupTasks(normalizedTasks).map((column) => (
            <Column
              key={column.id}
              column={column}
              tasks={column.tasks}
              isActive={dragOverStatus === column.id}
              onAdd={(status) => { setCreateStatus(status); setEditingTask({}); }}
              onDragStart={(taskId) => setDraggedTaskId(taskId)}
              onDragEnd={() => { setDraggedTaskId(null); setDragOverStatus(null); }}
              onDragOver={(status) => setDragOverStatus(status)}
              onDragLeave={() => setDragOverStatus(null)}
              onDrop={(status, taskId) => {
                if (taskId) {
                  moveTaskToStatus(taskId, status);
                }
              }}
            />
          ))
        )}
      </div>

      <TaskPanel
        task={activeTask}
        members={members}
        comments={taskComments}
        commentDraft={commentDraft}
        onCommentDraftChange={(event) => setCommentDraft(event.target.value)}
        onCommentSubmit={handleCommentSubmit}
        isCommenting={isCommenting}
        onClose={() => setActiveTask(null)}
        onEdit={() => { setEditingTask(activeTask); setActiveTask(null); }}
        onDelete={() => setDeletingTask(activeTask)}
      />
      {editingTask && <TaskForm task={editingTask.id ? editingTask : null} projectId={projectId} boardId={boardId} initialStatus={createStatus} members={members} onSaved={saveTask} onClose={() => setEditingTask(null)} />}
      {deletingTask && <ConfirmationModal title="Delete task?" message={`Delete "${deletingTask.title}"? This cannot be undone.`} confirmText="Delete" onCancel={() => setDeletingTask(null)} onConfirm={deleteTask} />}
    </TaskCtx.Provider>
  );
}

export default BoardPage;
