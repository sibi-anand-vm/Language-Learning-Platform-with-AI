const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  language: { 
    type: String, 
    required: true,
    enum: ['English', 'Spanish', 'French', 'German', 'Chinese'],  // You can expand the list of languages as needed
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
      translation: { type: String, required: true },  // Required field to ensure translation exists
    },
  ],
}, { timestamps: true });  // Add timestamps for createdAt and updatedAt automatically

module.exports = mongoose.model("Lesson", lessonSchema);
