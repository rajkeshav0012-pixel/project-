import { Link, useLocation } from "react-router-dom";

const navItems = [
  { path: "/", label: "Dashboard", icon: "📊" },
  { path: "/chat", label: "AI Chat", icon: "💬" },
  { path: "/progress", label: "Progress", icon: "📈" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div
      className="w-72 min-h-screen flex flex-col"
      style={{
        background: "var(--bg-sidebar)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid var(--border-subtle)",
      }}
    >
      {/* Logo */}
      <div className="p-8 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{
              background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
              boxShadow: "0 4px 15px rgba(139, 92, 246, 0.3)",
            }}
          >
            🧠
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">AI Study</h1>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Smart Learning Assistant
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-6 mb-4" style={{ borderBottom: "1px solid var(--border-subtle)" }} />

      {/* Navigation */}
      <nav className="flex flex-col gap-1 px-4 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              id={`nav-${item.label.toLowerCase().replace(" ", "-")}`}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
              style={{
                background: isActive
                  ? "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.1))"
                  : "transparent",
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                border: isActive
                  ? "1px solid rgba(139, 92, 246, 0.2)"
                  : "1px solid transparent",
                boxShadow: isActive ? "0 0 20px rgba(139, 92, 246, 0.1)" : "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.color = "var(--text-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }
              }}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium text-sm">{item.label}</span>
              {isActive && (
                <div
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{
                    background: "var(--accent-purple)",
                    boxShadow: "0 0 8px var(--accent-purple)",
                  }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-6">
        <div
          className="glass-card p-4 text-center"
          style={{ background: "rgba(139, 92, 246, 0.06)" }}
        >
          <p
            className="text-xs font-medium mb-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Pro Tip
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Ask AI to explain concepts with examples for better retention ✨
          </p>
        </div>
      </div>
    </div>
  );
}
