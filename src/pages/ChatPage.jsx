import ChatBox from "../components/ChatBox";
import FileUpload from "../components/FileUpload";
import GlowingEffect from "../components/GlowingEffect";

export default function ChatPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-6 animate-fade-in-up">
        <h1 className="text-2xl font-bold mb-1">
          <span className="gradient-text">AI Study Assistant</span> 🤖
        </h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Ask questions, upload notes, get instant explanations
        </p>
      </div>

      {/* Chat Box with GlowingEffect */}
      <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <GlowingEffect
          blur={14}
          spread={30}
          glow={false}
          disabled={false}
          borderWidth={1}
          movementDuration={2}
          className="rounded-2xl"
        >
          <ChatBox />
        </GlowingEffect>
      </div>

      {/* File Upload with GlowingEffect */}
      <div className="animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
        <GlowingEffect
          blur={8}
          spread={20}
          glow={false}
          disabled={false}
          variant="white"
          borderWidth={1}
          className="rounded-2xl mt-4"
        >
          <FileUpload />
        </GlowingEffect>
      </div>

      {/* Tips */}
      <div
        className="mt-6 flex flex-wrap gap-3 animate-fade-in-up"
        style={{ animationDelay: "0.2s" }}
      >
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          💡 Try:
        </p>
        {[
          "Explain quantum entanglement",
          "Solve x² + 5x + 6 = 0",
          "Summarize Chapter 3",
          "Create a study plan",
        ].map((tip) => (
          <span
            key={tip}
            className="text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border-subtle)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.3)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-subtle)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            {tip}
          </span>
        ))}
      </div>
    </div>
  );
}
