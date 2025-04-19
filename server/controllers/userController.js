const UserLesson=require("../models/UserLesson")
const User = require("../models/User");
exports.updateUserProfile = async (req, res) => {
    const userId = req.user.id;
    const { username, password, profilePic } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      // Update only if provided
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
  
  exports.deleteUser = async (req, res) => {
    const userId = req.user.id;
  
    try {
      const user = await User.findByIdAndDelete(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "User deletion failed", error: err.message });
    }
  };
  exports.getUserLessons = async (req, res) => {
    const userId = req.user.id;
  
    try {
      // Find all lessons created by the user
      const userLessons = await UserLesson.find({ userId }).populate("lessonId");
  
      if (!userLessons) {
        return res.status(404).json({ message: "No lessons found for this user" });
      }
  
      res.status(200).json(userLessons);
    } catch (err) {
      res.status(500).json({ message: "Error fetching lessons", error: err.message });
    }
  };
  
