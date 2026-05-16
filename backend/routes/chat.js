const express = require("express");
const authMiddleware = require("../middleware/auth");
const Message = require("../models/Message");
const Progress = require("../models/Progress");

const router = express.Router();

const SYSTEM_PROMPT =
  "You are an AI study assistant for students. Help them understand concepts clearly, solve problems step by step, create study plans, and make learning fun. You specialize in Physics, Mathematics, Chemistry, Biology, and Computer Science. Keep answers concise and educational. Use emojis occasionally 🎓";

// POST /api/chat  (auth optional — works without login too)
router.post("/", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Build conversation history for Pollinations.ai
    const aiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.map((m) => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.text,
      })),
      { role: "user", content: message },
    ];

    let aiReply;

    try {
      // Call api.airforce proxy — completely free, no API key required
      const response = await fetch("https://api.airforce/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: aiMessages,
          model: "gpt-3.5-turbo",
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      aiReply = data.choices?.[0]?.message?.content || "No response received.";
    } catch (aiError) {
      console.error("Free AI error:", aiError.message);
      aiReply = `⚠️ AI service temporarily unavailable. Please try again in a moment.`;
    }

    // If user is logged in, save messages and update progress
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const jwt = require("jsonwebtoken");
        const decoded = jwt.verify(
          authHeader.split(" ")[1],
          process.env.JWT_SECRET
        );
        const userId = decoded.id;

        await Message.create({ userId, role: "user", text: message });
        await Message.create({ userId, role: "ai", text: aiReply });

        await Progress.findOneAndUpdate(
          { userId },
          { $inc: { totalQuestionsAsked: 1 } },
          { upsert: true }
        );
      } catch (_) {
        // Token invalid — still return the AI reply, just don't save
      }
    }

    res.json({ reply: aiReply });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ message: "Server error processing your message" });
  }
});

// GET /api/chat/history  (auth required)
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({ userId: req.user.id })
      .sort({ createdAt: 1 })
      .limit(100);

    res.json({ messages });
  } catch (err) {
    console.error("Chat history error:", err);
    res.status(500).json({ message: "Server error fetching chat history" });
  }
});

module.exports = router;
