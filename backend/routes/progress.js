const express = require("express");
const authMiddleware = require("../middleware/auth");
const Progress = require("../models/Progress");

const router = express.Router();

// GET /api/progress  (auth required)
router.get("/", authMiddleware, async (req, res) => {
  try {
    let progress = await Progress.findOne({ userId: req.user.id });

    // Create default if doesn't exist
    if (!progress) {
      progress = await Progress.create({ userId: req.user.id });
    }

    // Compute summary stats
    const totalTopics = progress.subjects.reduce((sum, s) => sum + s.topics, 0);
    const completedTopics = progress.subjects.reduce((sum, s) => sum + s.completed, 0);
    const overallProgress =
      totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    const totalStudyHours = progress.weeklyHours.reduce((sum, d) => sum + d.hours, 0);

    res.json({
      subjects: progress.subjects,
      weeklyHours: progress.weeklyHours,
      totalQuestionsAsked: progress.totalQuestionsAsked,
      studyStreak: progress.studyStreak,
      stats: {
        overallProgress,
        totalTopics,
        completedTopics,
        totalStudyHours: totalStudyHours.toFixed(1),
      },
    });
  } catch (err) {
    console.error("Progress fetch error:", err);
    res.status(500).json({ message: "Server error fetching progress" });
  }
});

// PUT /api/progress/hours/:day — log study hours for a day (MUST be before /:subject)
router.put("/hours/:day", authMiddleware, async (req, res) => {
  try {
    const { day } = req.params;
    const { hours } = req.body;

    await Progress.findOneAndUpdate(
      { userId: req.user.id, "weeklyHours.day": day },
      { $set: { "weeklyHours.$.hours": hours } },
      { upsert: false, new: true }
    );

    res.json({ message: `Study hours updated for ${day}` });
  } catch (err) {
    console.error("Hours update error:", err);
    res.status(500).json({ message: "Server error updating hours" });
  }
});

// PUT /api/progress/:subject  — update a subject's progress
router.put("/:subject", authMiddleware, async (req, res) => {
  try {
    const { subject } = req.params;
    const { progress, completed } = req.body;

    const userProgress = await Progress.findOne({ userId: req.user.id });
    if (!userProgress) {
      return res.status(404).json({ message: "Progress record not found" });
    }

    const subjectEntry = userProgress.subjects.find(
      (s) => s.name.toLowerCase() === subject.toLowerCase()
    );

    if (!subjectEntry) {
      return res.status(404).json({ message: `Subject "${subject}" not found` });
    }

    if (progress !== undefined) subjectEntry.progress = Math.min(100, Math.max(0, progress));
    if (completed !== undefined) subjectEntry.completed = completed;

    await userProgress.save();

    res.json({ message: "Progress updated", subject: subjectEntry });
  } catch (err) {
    console.error("Progress update error:", err);
    res.status(500).json({ message: "Server error updating progress" });
  }
});

// POST /api/progress/subject  — add a new subject
router.post("/subject", authMiddleware, async (req, res) => {
  try {
    const { name, icon, color, topics } = req.body;
    if (!name) return res.status(400).json({ message: "Subject name is required" });

    const userProgress = await Progress.findOne({ userId: req.user.id });
    if (!userProgress) {
      return res.status(404).json({ message: "Progress record not found" });
    }

    // Check if it already exists
    const exists = userProgress.subjects.some((s) => s.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      return res.status(400).json({ message: "Subject already exists" });
    }

    const newSubject = {
      name,
      icon: icon || "📚",
      color: color || "#3b82f6",
      topics: Math.max(1, topics || 10),
      completed: 0,
      progress: 0,
    };

    userProgress.subjects.push(newSubject);
    await userProgress.save();

    res.json({ message: "Subject added", subject: newSubject });
  } catch (err) {
    console.error("Add subject error:", err);
    res.status(500).json({ message: "Server error adding subject" });
  }
});

// DELETE /api/progress/subject/:subject  — remove a subject
router.delete("/subject/:subject", authMiddleware, async (req, res) => {
  try {
    const { subject } = req.params;
    const userProgress = await Progress.findOne({ userId: req.user.id });
    if (!userProgress) {
      return res.status(404).json({ message: "Progress record not found" });
    }

    const initialLength = userProgress.subjects.length;
    userProgress.subjects = userProgress.subjects.filter(
      (s) => s.name.toLowerCase() !== subject.toLowerCase()
    );

    if (userProgress.subjects.length === initialLength) {
      return res.status(404).json({ message: `Subject "${subject}" not found` });
    }

    await userProgress.save();
    res.json({ message: "Subject removed" });
  } catch (err) {
    console.error("Delete subject error:", err);
    res.status(500).json({ message: "Server error deleting subject" });
  }
});

module.exports = router;
