import { useState } from "react";

const demoMessages = [
  {
    role: "ai",
    text: "Hello! I'm your AI study assistant. Ask me anything about your studies — I can explain concepts, solve problems, and create study plans. 🧠",
  },
  {
    role: "user",
    text: "Can you explain how photosynthesis works in simple terms?",
  },
  {
    role: "ai",
    text: "Of course! 🌿 Photosynthesis is how plants make food using sunlight. Think of it like a recipe:\n\n**Ingredients:** Water (H₂O) + Carbon Dioxide (CO₂) + Sunlight\n**Result:** Glucose (sugar) + Oxygen (O₂)\n\nThe chlorophyll in leaves captures sunlight energy to split water molecules and combine them with CO₂ to create sugar — the plant's food!",
  },
];

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(demoMessages);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages([...messages, { role: "user", text: message }]);
    setMessage("");
    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "That's a great question! Let me think about that... 🤔",
        },
      ]);
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="glass-card flex flex-col"
      style={{ height: "480px", padding: "24px" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 mb-4 pb-4"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
          style={{
            background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
          }}
        >
          🤖
        </div>
        <div>
          <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
            AI Assistant
          </h3>
          <div className="flex items-center gap-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full animate-pulse-glow"
              style={{ background: "var(--accent-green)" }}
            />
            <span className="text-xs" style={{ color: "var(--accent-green)" }}>
              Online
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto flex flex-col gap-4 pr-2"
        id="chat-messages"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className="max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
              style={{
                background:
                  msg.role === "user"
                    ? "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))"
                    : "rgba(255, 255, 255, 0.05)",
                color:
                  msg.role === "user"
                    ? "white"
                    : "var(--text-primary)",
                border:
                  msg.role === "ai"
                    ? "1px solid var(--border-subtle)"
                    : "none",
                borderBottomRightRadius: msg.role === "user" ? "4px" : undefined,
                borderBottomLeftRadius: msg.role === "ai" ? "4px" : undefined,
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex gap-3 mt-4 pt-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <input
          id="chat-input"
          className="dark-input flex-1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your study doubt..."
        />
        <button
          id="chat-send-btn"
          className="btn-gradient flex items-center gap-2"
          onClick={handleSend}
        >
          <span>Send</span>
          <span className="text-base">→</span>
        </button>
      </div>
    </div>
  );
}
