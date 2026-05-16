import { useState, useEffect, useRef } from "react";

const SYSTEM_PROMPT = `You are an AI study assistant. Help students understand concepts clearly and solve problems step by step. Keep your answers concise, educational, and strictly formatted in clean markdown without any HTML. Use emojis occasionally 🎓`;

const WELCOME_MSG = {
  role: "ai",
  text: "Hello! I'm your AI study assistant. Ask me anything — concepts, problem solving, study plans. 🧠",
};

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!message.trim() || isTyping) return;

    const userText = message.trim();
    const updatedMessages = [...messages, { role: "user", text: userText }];
    setMessages(updatedMessages);
    setMessage("");
    setIsTyping(true);

    try {
      // Build message list for the AI (include system prompt, exclude welcome message)
      const aiMessages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...updatedMessages
          .filter((m) => m.role !== "ai" || m.text !== WELCOME_MSG.text)
          .map((m) => ({
            role: m.role === "ai" ? "assistant" : "user",
            content: m.text,
          })),
      ];

      // Call our local backend proxy → it calls Google Gemini server-side (no CORS)
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: aiMessages }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "AI service error");

      setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: `⚠️ ${err.message}\n\nMake sure the backend server is running:\n cd backend && npm run dev`,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => setMessages([WELCOME_MSG]);

  return (
    <div
      className="glass-card flex flex-col"
      style={{ height: "520px", padding: "28px" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between gap-3 mb-4 pb-4"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        <div className="flex items-center gap-3">
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

        {/* Clear chat */}
        <button
          title="Clear chat"
          onClick={clearChat}
          className="text-xs px-2 py-1 rounded-lg transition-all duration-200"
          style={{
            background: "rgba(0, 0, 0,0.03)",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-muted)",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)";
            e.currentTarget.style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border-subtle)";
            e.currentTarget.style.color = "var(--text-muted)";
          }}
        >
          🗑 Clear
        </button>
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
                    : "rgba(0, 0, 0, 0.03)",
                color: msg.role === "user" ? "white" : "var(--text-primary)",
                border: msg.role === "ai" ? "1px solid var(--border-subtle)" : "none",
                borderBottomRightRadius: msg.role === "user" ? "4px" : undefined,
                borderBottomLeftRadius: msg.role === "ai" ? "4px" : undefined,
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div
              className="rounded-2xl px-4 py-3 flex items-center gap-1.5"
              style={{
                background: "rgba(0, 0, 0, 0.03)",
                border: "1px solid var(--border-subtle)",
                borderBottomLeftRadius: "4px",
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full animate-pulse-glow"
                  style={{
                    background: "var(--accent-purple)",
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        className="flex gap-3 mt-4 pt-4"
        style={{ borderTop: "1px solid var(--border-subtle)" }}
      >
        <input
          id="chat-input"
          className="dark-input flex-1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your study doubt..."
          disabled={isTyping}
        />
        <button
          id="chat-send-btn"
          className="btn-gradient flex items-center gap-2"
          onClick={handleSend}
          disabled={isTyping || !message.trim()}
          style={{ opacity: isTyping || !message.trim() ? 0.6 : 1 }}
        >
          <span>Send</span>
          <span className="text-base">→</span>
        </button>
      </div>
    </div>
  );
}
