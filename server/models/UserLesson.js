const mongoose = require("mongoose");

const userLessonSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
    learnedWords: [String], // Store the words learned
    completedAt: { type: Date, default: Date.now } // Custom completed timestamp
  },
  {
    timestamps: true // Optionally, this will add createdAt and updatedAt
  }
);

module.exports = mongoose.model("UserLesson", userLessonSchema);
