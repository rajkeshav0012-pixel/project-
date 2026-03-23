const express = require("express");

const router = express.Router();

// POST /api/ai  — free, no key needed, proxies Pollinations.ai server-side
router.post("/", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: "messages array is required" });
    }

    // Call Pollinations.ai from the backend (no CORS issue server-side)
    const response = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages,
        model: "openai",
      }),
    });

    if (!response.ok) {
      throw new Error(`Pollinations returned ${response.status}`);
    }

    const text = await response.text();
    res.json({ reply: text.trim() });
  } catch (err) {
    console.error("Free AI proxy error:", err.message);
    res.status(502).json({ message: `AI service error: ${err.message}` });
  }
});

module.exports = router;
