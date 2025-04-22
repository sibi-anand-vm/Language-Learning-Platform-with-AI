const mongoose = require("mongoose");

const audioSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  lessonId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Lesson', 
    required: true 
  },
  audioUrl: { 
    type: String, 
    required: true 
  },
  score: { 
    type: Number, 
    required: true 
  },
  pronunciationDate: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

module.exports = mongoose.model("Audio", audioSchema);
