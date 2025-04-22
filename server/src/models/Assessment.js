const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lessons',
    required: true
  },
  word: String,
  transcribedText: String,
  accuracyMarks: Number,
  pitchIntensityMarks: Number,
  finalMarks: Number,
  feedback: [String],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Assessment', AssessmentSchema);
