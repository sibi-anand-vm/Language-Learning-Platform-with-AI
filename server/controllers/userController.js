const User = require("../models/User");
const Lesson = require("../models/Lesson");
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
// Get all lessons created by the user
exports.getUserLessons = async (req, res) => {
  const userId = req.user.id;

  try {
    const userLessons = await Lesson.find({ userId })
      .populate("lessonId")
      .lean(); // Use lean() for better performance

    // Filter only lessons where createdBy === userId
    const createdLessons = userLessons.filter(
      (ul) => ul.lessonId && ul.lessonId.createdBy?.toString() === userId
    );

    res.status(200).json(createdLessons);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user lessons", error: err.message });
  }
};
