const mongoose = require("mongoose");

const defaultSubjects = [
  { name: "Physics", icon: "⚛️", progress: 0, topics: 12, completed: 0, color: "#3b82f6" },
  { name: "Mathematics", icon: "📐", progress: 0, topics: 15, completed: 0, color: "#8b5cf6" },
  { name: "Chemistry", icon: "🧪", progress: 0, topics: 10, completed: 0, color: "#ec4899" },
  { name: "Biology", icon: "🧬", progress: 0, topics: 8, completed: 0, color: "#10b981" },
  { name: "Computer Science", icon: "💻", progress: 0, topics: 14, completed: 0, color: "#22d3ee" },
];

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    subjects: {
      type: [
        {
          name: String,
          icon: String,
          progress: { type: Number, default: 0, min: 0, max: 100 },
          topics: { type: Number, default: 0 },
          completed: { type: Number, default: 0 },
          color: String,
        },
      ],
      default: defaultSubjects,
    },
    weeklyHours: {
      type: [
        {
          day: String,
          hours: { type: Number, default: 0 },
        },
      ],
      default: [
        { day: "Mon", hours: 0 },
        { day: "Tue", hours: 0 },
        { day: "Wed", hours: 0 },
        { day: "Thu", hours: 0 },
        { day: "Fri", hours: 0 },
        { day: "Sat", hours: 0 },
        { day: "Sun", hours: 0 },
      ],
    },
    totalQuestionsAsked: { type: Number, default: 0 },
    studyStreak: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Progress", progressSchema);
