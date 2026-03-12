import GlowingEffect from "../components/GlowingEffect";

const subjects = [
  {
    name: "Physics",
    icon: "⚛️",
    progress: 78,
    color: "var(--accent-blue)",
    topics: 12,
    completed: 9,
  },
  {
    name: "Mathematics",
    icon: "📐",
    progress: 65,
    color: "var(--accent-purple)",
    topics: 15,
    completed: 10,
  },
  {
    name: "Chemistry",
    icon: "🧪",
    progress: 42,
    color: "var(--accent-pink)",
    topics: 10,
    completed: 4,
  },
  {
    name: "Biology",
    icon: "🧬",
    progress: 90,
    color: "var(--accent-green)",
    topics: 8,
    completed: 7,
  },
  {
    name: "Computer Science",
    icon: "💻",
    progress: 55,
    color: "var(--accent-cyan)",
    topics: 14,
    completed: 8,
  },
];

const weeklyData = [
  { day: "Mon", hours: 3.5 },
  { day: "Tue", hours: 2.0 },
  { day: "Wed", hours: 4.5 },
  { day: "Thu", hours: 1.5 },
  { day: "Fri", hours: 5.0 },
  { day: "Sat", hours: 4.0 },
  { day: "Sun", hours: 4.0 },
];

const maxHours = Math.max(...weeklyData.map((d) => d.hours));

export default function ProgressPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-2xl font-bold mb-1">
          <span className="gradient-text">Study Progress</span> 📈
        </h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Track your learning journey across all subjects
        </p>
      </div>

      {/* Overall Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 stagger-children">
        {[
          { label: "Overall Progress", value: "66%", icon: "🎯" },
          { label: "Weekly Streak", value: "5 days", icon: "🔥" },
          { label: "Total Topics", value: "38/59", icon: "📖" },
        ].map((stat) => (
          <div key={stat.label} className="animate-fade-in-up">
            <div
              className="glass-card flex items-center gap-4"
              style={{ padding: "16px 20px" }}
            >
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {stat.label}
                </p>
                <p className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Study Hours Chart */}
      <div className="mb-8 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
        <GlowingEffect
          blur={10}
          spread={25}
          glow={false}
          disabled={false}
          borderWidth={1}
          className="rounded-2xl"
        >
          <div className="glass-card" style={{ padding: "24px" }}>
            <h2 className="text-base font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
              Weekly Study Hours
            </h2>
            <div className="flex items-end gap-3 justify-between" style={{ height: "140px" }}>
              {weeklyData.map((d) => (
                <div key={d.day} className="flex flex-col items-center gap-2 flex-1">
                  <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                    {d.hours}h
                  </span>
                  <div
                    className="w-full rounded-t-lg transition-all duration-700"
                    style={{
                      height: `${(d.hours / maxHours) * 100}%`,
                      minHeight: "8px",
                      background: `linear-gradient(to top, var(--accent-blue), var(--accent-purple))`,
                      opacity: 0.8,
                    }}
                  />
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {d.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </GlowingEffect>
      </div>

      {/* Subject Progress Cards */}
      <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          Subject Progress
        </h2>
        <div className="flex flex-col gap-4 stagger-children">
          {subjects.map((subject) => (
            <div key={subject.name} className="animate-fade-in-up">
              <GlowingEffect
                blur={10}
                spread={20}
                glow={false}
                disabled={false}
                borderWidth={1}
                movementDuration={3}
                className="rounded-xl"
              >
                <div className="glass-card" style={{ padding: "20px" }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                        style={{
                          background: `${subject.color}15`,
                          border: `1px solid ${subject.color}25`,
                        }}
                      >
                        {subject.icon}
                      </div>
                      <div>
                        <h3
                          className="font-semibold text-sm"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {subject.name}
                        </h3>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                          {subject.completed}/{subject.topics} topics completed
                        </p>
                      </div>
                    </div>
                    <span
                      className="text-lg font-bold"
                      style={{ color: subject.color }}
                    >
                      {subject.progress}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${subject.progress}%`,
                        background: `linear-gradient(90deg, ${subject.color}, ${subject.color}cc)`,
                      }}
                    />
                  </div>
                </div>
              </GlowingEffect>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
