const express = require("express");
const https = require("https");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

// ── Helper: HTTPS POST using built-in Node.js https module ───────────────────
function httpsPost(hostname, path, headers, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = https.request(
      {
        hostname,
        path,
        method: "POST",
        headers: { ...headers, "Content-Length": Buffer.byteLength(data) },
        timeout: 30000,
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => (raw += chunk));
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(raw));
            } catch {
              resolve(raw);
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${raw.slice(0, 200)}`));
          }
        });
      }
    );
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Request timed out")); });
    req.write(data);
    req.end();
  });
}

// ── Groq (free: 14,400 req/day with GROQ_API_KEY from console.groq.com) ──────
async function callGroq(messages, groqKey) {
  const data = await httpsPost(
    "api.groq.com",
    "/openai/v1/chat/completions",
    {
      "Content-Type": "application/json",
      Authorization: `Bearer ${groqKey}`,
    },
    { model: "llama-3.3-70b-versatile", messages, max_tokens: 1024 }
  );
  return data.choices[0].message.content.trim();
}

// ── Gemini (uses GEMINI_API_KEY) ──────────────────────────────────────────────
async function callGemini(chatMessages, systemText, apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const modelConfig = { model: process.env.GEMINI_MODEL || "gemini-2.0-flash" };
  if (systemText) {
    modelConfig.systemInstruction = { parts: [{ text: systemText }] };
  }
  const model = genAI.getGenerativeModel(modelConfig);
  const lastMessage = chatMessages.pop();
  const chat = model.startChat({ history: chatMessages });
  const result = await chat.sendMessage(lastMessage.parts[0].text);
  return result.response.text().trim();
}

// ── Pollinations.ai (no key needed, best-effort free) ────────────────────────
async function callPollinations(messages) {
  const data = await httpsPost(
    "text.pollinations.ai",
    "/openai/chat/completions",
    { "Content-Type": "application/json" },
    { model: "openai", messages }
  );
  if (typeof data === "string") throw new Error("Unexpected text response");
  return data.choices[0].message.content.trim();
}

// POST /api/ai ─────────────────────────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: "messages array is required" });
    }

    // Build Gemini-format and plain-format message arrays
    let systemText = "";
    const geminiMessages = [];
    const plainMessages = [];

    for (const msg of messages) {
      if (msg.role === "system") {
        systemText = msg.content;
        plainMessages.push({ role: "system", content: msg.content });
      } else {
        geminiMessages.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        });
        plainMessages.push({
          role: msg.role === "assistant" ? "assistant" : "user",
          content: msg.content,
        });
      }
    }

    if (geminiMessages.length === 0 || geminiMessages[0].role !== "user") {
      return res.status(400).json({ message: "Conversation must start with a user message" });
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;
    let reply = "";
    let source = "";

    // Priority: Gemini → Groq → Pollinations
    if (geminiKey && geminiKey !== "your_gemini_api_key_here") {
      try {
        reply = await callGemini([...geminiMessages], systemText, geminiKey);
        source = "Gemini";
      } catch (e) {
        console.warn("⚠️  Gemini failed:", e.message);
      }
    }

    if (!reply && groqKey && groqKey !== "your_groq_api_key_here") {
      try {
        reply = await callGroq(plainMessages, groqKey);
        source = "Groq";
      } catch (e) {
        console.warn("⚠️  Groq failed:", e.message);
      }
    }

    if (!reply) {
      try {
        reply = await callPollinations(plainMessages);
        source = "Pollinations";
      } catch (e) {
        console.warn("⚠️  Pollinations failed:", e.message);
        throw new Error("All AI providers failed. Check GROQ_API_KEY in backend/.env");
      }
    }

    console.log(`✅ AI response from ${source}`);
    res.json({ reply });
  } catch (err) {
    console.error("AI error:", err.message);
    res.status(502).json({ message: err.message });
  }
});

module.exports = router;
