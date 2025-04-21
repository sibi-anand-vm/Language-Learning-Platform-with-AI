const User = require("../models/User");
const Lesson = require("../models/Lesson");
const UserLesson = require("../models/UserLesson");
const bcrypt = require("bcrypt");

// Update user profile
exports.updateUserProfile = async (req, res) => {
  const userId = req.user.id;
  const { username, password, profilePic } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (username) user.username = username;
    if (profilePic) user.profilePic = profilePic;
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      user.password = hashed;
    }

    const updatedUser = await user.save();
    res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete user's lessons (optional: only delete lessons they created)
    await Lesson.deleteMany({ createdBy: userId });

    // Remove UserLesson links
    await UserLesson.deleteMany({ userId });

    res.status(200).json({ message: "User and associated data deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "User deletion failed", error: err.message });
  }
};

// Get user's lessons
exports.getUserLessons = async (req, res) => {
  const userId = req.user.id;

  try {
    // Get lessons created by the user
    const createdLessons = await Lesson.find({ createdBy: userId })
      .select('-__v') // Exclude version field
      .lean();

    // Get lessons the user has completed
    const completedLessons = await UserLesson.find({ userId })
      .populate('lessonId', '-__v')
      .lean();

    // Combine lessons and remove duplicates
    const lessonMap = new Map();
    
    // Add created lessons first
    createdLessons.forEach(lesson => {
      lessonMap.set(lesson._id.toString(), lesson);
    });

    // Add completed lessons, but don't override created ones
    completedLessons.forEach(ul => {
      if (ul.lessonId && !lessonMap.has(ul.lessonId._id.toString())) {
        lessonMap.set(ul.lessonId._id.toString(), ul.lessonId);
      }
    });

    // Convert map values back to array
    const formattedLessons = Array.from(lessonMap.values());

    res.status(200).json(formattedLessons);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user lessons", error: err.message });
  }
};

