const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  language: { 
    type: String, 
    required: true,
    enum: ['English', 'Spanish', 'French', 'German', 'Chinese'],
  },
  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    required: true,
  },
  content: { 
    type: String, 
    required: true 
  },
  vocab: [
    {
      word: { type: String, required: true },  
      translation: { type: String, required: true },
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null, // null means created by system
  }
}, { timestamps: true });

module.exports = mongoose.model("Lesson", lessonSchema);
