import { useMemo, useState } from "react";
import { Bell, CheckCircle2, Clock3, MessageSquareText, Sparkles, UserPlus, AlertCircle } from "lucide-react";
import { C, FONT } from "../../constants/theme";
import Button from "../../components/ui/Button";

const mockNotifications = [
  {
    id: 1,
    type: "task",
    title: "Design review requested",
    message: "Alicia assigned you to review the onboarding dashboard updates.",
    time: "5 minutes ago",
    read: false,
    priority: "high",
  },
  {
    id: 2,
    type: "mention",
    title: "You were mentioned in a comment",
    message: "Marcus mentioned you in the Sprint 12 planning thread.",
    time: "22 minutes ago",
    read: false,
    priority: "medium",
  },
  {
    id: 3,
    type: "system",
    title: "New workspace invite accepted",
    message: "Nina accepted the invite to Product Launch workspace.",
    time: "1 hour ago",
    read: true,
    priority: "low",
  },
  {
    id: 4,
    type: "task",
    title: "QA checklist updated",
    message: "The release checklist has been updated with 3 new items.",
    time: "2 hours ago",
    read: true,
    priority: "medium",
  },
  {
    id: 5,
    type: "system",
    title: "Sprint health improved",
    message: "The sprint delivery risk dropped below 20% this week.",
    time: "Yesterday",
    read: true,
    priority: "low",
  },
  {
    id: 6,
    type: "mention",
    title: "Comment reply waiting",
    message: "You have a new reply on the mobile app notes discussion.",
    time: "Yesterday",
    read: false,
    priority: "medium",
  },
];

const filterOptions = ["all", "unread", "task", "mention", "system"];

const typeMeta = {
  task: { label: "Task", color: C.accent, icon: CheckCircle2 },
  mention: { label: "Mention", color: C.amber, icon: MessageSquareText },
  system: { label: "System", color: C.success, icon: Sparkles },
};

function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "all") return mockNotifications;
    if (activeFilter === "unread") return mockNotifications.filter((item) => !item.read);
    return mockNotifications.filter((item) => item.type === activeFilter);
  }, [activeFilter]);

  const unreadCount = mockNotifications.filter((item) => !item.read).length;
  const importantCount = mockNotifications.filter((item) => item.priority === "high").length;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FONT, padding: "32px 28px" }}>
      <div style={{ maxWidth: 1040, margin: "0 auto", width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            marginBottom: 20,
            padding: "18px 20px",
            borderRadius: 18,
            background: "linear-gradient(135deg, rgba(79,70,229,0.10), rgba(79,70,229,0.02))",
            border: `1px solid ${C.border}`,
          }}
        >
          <div>
            <div style={{ fontSize: 12, color: C.textFaint, letterSpacing: 0.7, textTransform: "uppercase", marginBottom: 6 }}>
              Updates
            </div>
            <div style={{ fontSize: 30, color: C.text, fontWeight: 700 }}>Notifications</div>
          </div>

          <Button variant="secondary" icon={Bell}>
            Mark all read
          </Button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 20 }}>
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 18px" }}>
            <div style={{ fontSize: 12, color: C.textFaint, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 }}>Unread</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: C.text }}>{unreadCount}</div>
          </div>

          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 18px" }}>
            <div style={{ fontSize: 12, color: C.textFaint, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 }}>Important</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: C.text }}>{importantCount}</div>
          </div>

          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 18px" }}>
            <div style={{ fontSize: 12, color: C.textFaint, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 }}>Today</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: C.text }}>7</div>
          </div>
        </div>

        <div style={{ marginBottom: 18, display: "flex", flexWrap: "wrap", gap: 8 }}>
          {filterOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setActiveFilter(option)}
              style={{
                borderRadius: 999,
                border: `1px solid ${activeFilter === option ? C.accent : C.border}`,
                background: activeFilter === option ? C.accentSoft : C.panel,
                color: activeFilter === option ? C.accent : C.textMuted,
                padding: "8px 12px",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 0.2,
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {option}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filteredNotifications.length === 0 ? (
            <div
              style={{
                background: C.panel,
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                padding: "32px 20px",
                textAlign: "center",
                color: C.textFaint,
              }}
            >
              No notifications in this view.
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const meta = typeMeta[notification.type] || typeMeta.system;
              const Icon = meta.icon;

              return (
                <div
                  key={notification.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto minmax(0, 1fr) auto",
                    gap: 14,
                    alignItems: "center",
                    background: C.panel,
                    border: `1px solid ${notification.read ? C.border : C.accent}33`,
                    borderRadius: 14,
                    padding: "16px 18px",
                    boxShadow: `0 8px 20px ${C.shadow}`,
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      background: `${meta.color}1A`,
                      border: `1px solid ${meta.color}33`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: meta.color,
                    }}
                  >
                    <Icon size={18} />
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{notification.title}</div>
                      {!notification.read && (
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: C.accent,
                            boxShadow: `0 0 0 4px ${C.accent}22`,
                          }}
                        />
                      )}
                    </div>
                    <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.55 }}>{notification.message}</div>
                  </div>

                  <div style={{ textAlign: "right", minWidth: 110 }}>
                    <div style={{ fontSize: 11, color: C.textFaint, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
                      {meta.label}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6, color: C.textFaint, fontSize: 12 }}>
                      <Clock3 size={12} />
                      {notification.time}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;
