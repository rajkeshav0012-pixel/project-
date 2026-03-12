import GlowingEffect from "../components/GlowingEffect";

const metrics = [
  {
    icon: "⏱️",
    label: "Study Hours",
    value: "24.5",
    unit: "hrs this week",
    color: "var(--accent-blue)",
    trend: "+3.2h",
    trendUp: true,
  },
  {
    icon: "✅",
    label: "Tasks Done",
    value: "18",
    unit: "of 25 tasks",
    color: "var(--accent-green)",
    trend: "+5",
    trendUp: true,
  },
  {
    icon: "🤖",
    label: "AI Doubts",
    value: "42",
    unit: "questions asked",
    color: "var(--accent-purple)",
    trend: "+12",
    trendUp: true,
  },
];

const quickActions = [
  { icon: "💬", label: "Start Chat", desc: "Ask AI a question" },
  { icon: "📝", label: "New Task", desc: "Create study task" },
  { icon: "📚", label: "Upload Notes", desc: "Share your notes" },
];

export default function Dashboard() {
  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, <span className="gradient-text">Student</span> 👋
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Here&apos;s your study overview for this week. Keep up the great work!
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 stagger-children">
        {metrics.map((metric) => (
          <div key={metric.label} className="animate-fade-in-up">
            <GlowingEffect
              blur={12}
              spread={25}
              glow={false}
              disabled={false}
              borderWidth={1}
              movementDuration={2.5}
              className="rounded-2xl"
            >
              <div className="glass-card" style={{ padding: "24px" }}>
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                    style={{
                      background: `${metric.color}15`,
                      border: `1px solid ${metric.color}25`,
                    }}
                  >
                    {metric.icon}
                  </div>
                  <span
                    className="text-xs font-semibold px-2 py-1 rounded-lg"
                    style={{
                      background: metric.trendUp
                        ? "rgba(16, 185, 129, 0.1)"
                        : "rgba(239, 68, 68, 0.1)",
                      color: metric.trendUp
                        ? "var(--accent-green)"
                        : "#ef4444",
                    }}
                  >
                    {metric.trendUp ? "↑" : "↓"} {metric.trend}
                  </span>
                </div>
                <h2
                  className="text-3xl font-bold mb-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  {metric.value}
                </h2>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {metric.label}
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  {metric.unit}
                </p>
              </div>
            </GlowingEffect>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <GlowingEffect
              key={action.label}
              blur={8}
              spread={20}
              glow={false}
              disabled={false}
              variant="white"
              borderWidth={1}
              className="rounded-xl"
            >
              <button
                id={`action-${action.label.toLowerCase().replace(" ", "-")}`}
                className="glass-card w-full text-left flex items-center gap-4 transition-all duration-300"
                style={{ padding: "16px 20px", cursor: "pointer", border: "none" }}
              >
                <span className="text-2xl">{action.icon}</span>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                    {action.label}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {action.desc}
                  </p>
                </div>
              </button>
            </GlowingEffect>
          ))}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="mt-8 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          Recent Activity
        </h2>
        <div className="glass-card" style={{ padding: "20px" }}>
          {[
            { time: "2h ago", text: "Completed Physics Chapter 5 quiz", icon: "✅" },
            { time: "4h ago", text: "Asked AI about quantum mechanics", icon: "💬" },
            { time: "Yesterday", text: "Uploaded Chemistry notes", icon: "📎" },
            { time: "2 days ago", text: "Finished Math practice set", icon: "📊" },
          ].map((activity, i) => (
            <div
              key={i}
              className="flex items-center gap-4 py-3"
              style={{
                borderBottom:
                  i < 3 ? "1px solid var(--border-subtle)" : "none",
              }}
            >
              <span className="text-lg">{activity.icon}</span>
              <div className="flex-1">
                <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                  {activity.text}
                </p>
              </div>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
