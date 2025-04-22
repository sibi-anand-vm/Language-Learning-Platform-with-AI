const mongoose = require("mongoose");

const userLessonSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
    learnedWords: [String],
    completedAt: { type: Date, default: Date.now } 
  },
  {
    timestamps: true 
  }
);

module.exports = mongoose.model("UserLesson", userLessonSchema);
