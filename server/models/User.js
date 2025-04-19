const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  usermail: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [/.+\@.+\..+/, 'Please enter a valid email address'] 
  },
  password: { 
    type: String, 
    required: true,
    minlength: 8,  
  },
  profilePic: { 
    type: String, 
    default: "https://example.com/default-profile.png" 
  },
  progress: {
    lessonsCompleted: { 
      type: Number, 
      default: 0 
    },
    pronunciationScores: [{
      score: { type: Number, required: true }, 
      date: { type: Date, default: Date.now },
      lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }  
    }],
  },
}, { timestamps: true });

// Hash password before saving it
userSchema.pre("save", async function(next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.virtual('lessonsCompleted').get(function() {
  return this.progress.pronunciationScores.filter(score => score.score >= 50).length; 
});

module.exports = mongoose.model("User", userSchema);
