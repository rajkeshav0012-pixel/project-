import { useState, useEffect } from "react";
import GlowingEffect from "../components/GlowingEffect";
import { progressAPI } from "../lib/api";

// Default demo data used when not logged in or API fails
const DEFAULT_SUBJECTS = [
  { name: "Physics", icon: "⚛️", progress: 78, color: "#3b82f6", topics: 12, completed: 9 },
  { name: "Mathematics", icon: "📐", progress: 65, color: "#8b5cf6", topics: 15, completed: 10 },
  { name: "Chemistry", icon: "🧪", progress: 42, color: "#ec4899", topics: 10, completed: 4 },
  { name: "Biology", icon: "🧬", progress: 90, color: "#10b981", topics: 8, completed: 7 },
  { name: "Computer Science", icon: "💻", progress: 55, color: "#22d3ee", topics: 14, completed: 8 },
];

const DEFAULT_WEEKLY = [
  { day: "Mon", hours: 3.5 },
  { day: "Tue", hours: 2.0 },
  { day: "Wed", hours: 4.5 },
  { day: "Thu", hours: 1.5 },
  { day: "Fri", hours: 5.0 },
  { day: "Sat", hours: 4.0 },
  { day: "Sun", hours: 4.0 },
];

export default function ProgressPage() {
  const [subjects, setSubjects] = useState(DEFAULT_SUBJECTS);
  const [weeklyData, setWeeklyData] = useState(DEFAULT_WEEKLY);
  const [stats, setStats] = useState({
    overallProgress: 66,
    totalTopics: 59,
    completedTopics: 38,
    totalStudyHours: "24.5",
  });
  const [questionsAsked, setQuestionsAsked] = useState(42);
  const [studyStreak, setStudyStreak] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  
  // Add Subject Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSubName, setNewSubName] = useState("");
  const [newSubIcon, setNewSubIcon] = useState("📚");
  const [newSubColor, setNewSubColor] = useState("#3b82f6");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      const isLoggedIn = !!localStorage.getItem("token");
      if (!isLoggedIn) {
        setIsLoading(false);
        return;
      }
      try {
        const { data } = await progressAPI.getProgress();
        setSubjects(data.subjects);
        setWeeklyData(data.weeklyHours);
        setStats(data.stats);
        setQuestionsAsked(data.totalQuestionsAsked);
        setStudyStreak(data.studyStreak);
      } catch (err) {
        console.error("Failed to load progress:", err);
        // Fall back to demo data silently
      } finally {
        setIsLoading(false);
      }
    };
    fetchProgress();
  }, []);

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubName.trim()) return;
    setIsAdding(true);
    try {
      const { data } = await progressAPI.addSubject({
        name: newSubName,
        icon: newSubIcon,
        color: newSubColor,
      });
      setSubjects((prev) => [...prev, data.subject]);
      setNewSubName("");
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add subject");
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveSubject = async (subjectName) => {
    if (!window.confirm(`Are you sure you want to remove ${subjectName}?`)) return;
    try {
      await progressAPI.removeSubject(subjectName);
      setSubjects((prev) => prev.filter((s) => s.name !== subjectName));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to remove subject");
    }
  };

  const maxHours = Math.max(...weeklyData.map((d) => d.hours), 1);

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 stagger-children">
        {[
          { label: "Overall Progress", value: `${stats.overallProgress}%`, icon: "🎯" },
          { label: "Weekly Streak", value: `${studyStreak} days`, icon: "🔥" },
          { label: "Total Topics", value: `${stats.completedTopics}/${stats.totalTopics}`, icon: "📖" },
          { label: "AI Questions", value: questionsAsked, icon: "🤖" },
        ].map((stat) => (
          <div key={stat.label} className="animate-fade-in-up">
            <div
              className="glass-card flex items-center gap-4"
              style={{ padding: "20px 24px" }}
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
        <GlowingEffect blur={10} spread={25} glow={false} disabled={false} borderWidth={1} className="rounded-2xl">
          <div className="glass-card" style={{ padding: "28px" }}>
            <h2 className="text-base font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
              Weekly Study Hours
            </h2>
            {isLoading ? (
              <div className="flex items-center justify-center h-36" style={{ color: "var(--text-muted)" }}>
                Loading...
              </div>
            ) : (
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
            )}
          </div>
        </GlowingEffect>
      </div>

      {/* Subject Progress Cards */}
      <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Subject Progress
          </h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-sm px-3 py-1 rounded-lg transition-colors"
            style={{
              background: "var(--accent-blue)",
              color: "white",
              opacity: showAddForm ? 0.7 : 1,
            }}
          >
            {showAddForm ? "Cancel" : "+ Add Subject"}
          </button>
        </div>

        {showAddForm && (
          <form
            onSubmit={handleAddSubject}
            className="glass-card mb-4 p-4 flex flex-col md:flex-row gap-4 items-end animate-fade-in-up"
          >
            <div className="flex-1 w-full">
              <label className="text-xs text-[var(--text-secondary)] mb-1 block">Subject Name</label>
              <input
                type="text"
                required
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
                placeholder="e.g. History"
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent-blue)] focus:outline-none"
              />
            </div>
            <div className="w-24">
              <label className="text-xs text-[var(--text-secondary)] mb-1 block">Icon</label>
              <input
                type="text"
                value={newSubIcon}
                onChange={(e) => setNewSubIcon(e.target.value)}
                placeholder="📚"
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-center focus:border-[var(--accent-blue)] focus:outline-none"
              />
            </div>
            <div className="w-24">
              <label className="text-xs text-[var(--text-secondary)] mb-1 block">Color</label>
              <input
                type="color"
                value={newSubColor}
                onChange={(e) => setNewSubColor(e.target.value)}
                className="w-full h-[38px] bg-transparent border-0 cursor-pointer"
              />
            </div>
            <button
              type="submit"
              disabled={isAdding}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all h-[38px] w-full md:w-auto flex items-center justify-center justify-self-stretch"
              style={{ background: "var(--text-primary)", color: "var(--bg-primary)" }}
            >
              {isAdding ? "Adding..." : "Save"}
            </button>
          </form>
        )}

        <div className="flex flex-col gap-4 stagger-children">
          {subjects.map((subject) => (
            <div key={subject.name} className="animate-fade-in-up">
              <GlowingEffect blur={10} spread={20} glow={false} disabled={false} borderWidth={1} movementDuration={3} className="rounded-xl">
                <div className="glass-card" style={{ padding: "24px" }}>
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
                        <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                          {subject.name}
                        </h3>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                          {subject.completed}/{subject.topics} topics completed
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold" style={{ color: subject.color }}>
                        {subject.progress}%
                      </span>
                      <button
                        onClick={() => handleRemoveSubject(subject.name)}
                        className="hover:scale-110 transition-transform opacity-60 hover:opacity-100"
                        title="Remove Subject"
                        style={{ filter: "grayscale(100%) brightness(200%)" }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
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
