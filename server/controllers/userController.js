const User = require("../models/User");
const Lesson = require("../models/Lesson");
const UserLesson = require("../models/UserLesson");
const bcrypt = require("bcrypt");
const Feedback = require("../models/Assessment");
const jwt = require('jsonwebtoken');

exports.updateUserProfile = async (req, res) => {
  const userId = req.user.id;
  const { username, profilePic, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update username and profile picture if provided
    if (username) user.username = username;
    if (profilePic) user.profilePic = profilePic;

    let passwordChanged = false;

    // Handle password change if requested
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required to change password" });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      // Validate new password
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters long" });
      }

      // Hash and set new password
      const hashed = await bcrypt.hash(newPassword, 10);
      user.password = hashed;
      passwordChanged = true;
    }

    // Save changes
    const updatedUser = await user.save();

    // Return updated user without sensitive data
    const userResponse = {
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };

    // Generate new token if password was changed
    let token = null;
    if (passwordChanged) {
      token = jwt.sign(
        { id: updatedUser._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
    }

    res.status(200).json({ 
      message: "Profile updated successfully", 
      user: userResponse,
      token: token // Only included if password was changed
    });
  } catch (err) {
    res.status(500).json({ 
      message: "Update failed", 
      error: err.message 
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    await Lesson.deleteMany({ createdBy: userId });

    // Remove UserLesson links
    await UserLesson.deleteMany({ userId });

    res.status(200).json({ message: "User and associated data deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "User deletion failed", error: err.message });
  }
};

exports.getUserLessons = async (req, res) => {
  const userId = req.user.id;

  try {
    const createdLessons = await Lesson.find({ createdBy: userId })
      .select('-__v') // Exclude version field
      .lean();

    const completedLessons = await UserLesson.find({ userId })
      .populate('lessonId', '-__v')
      .lean();

    const lessonMap = new Map();
    
    createdLessons.forEach(lesson => {
      lessonMap.set(lesson._id.toString(), lesson);
    });

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

// Get user statistics
exports.getUserStats = async (req, res) => {
  const userId = req.user.id;

  try {
    const feedbacks = await Feedback.find({ userId }).lean();

    const stats = {
      totalLessons: 0,
      completedLessons: 0,
      averageScore: 0,
      totalScore: 0,
      lessonsByLanguage: {},
      recentActivity: [],
      uniqueWords: new Set(),
      uniqueLessons: new Set(),
      totalAttempts: 0 // Track total number of attempts
    };

    for (const feedback of feedbacks) {
      const lesson = await Lesson.findById(feedback.lessonId).lean();

      if (!lesson) continue;

      // Track unique lessons
      stats.uniqueLessons.add(lesson._id.toString());

      // Track unique words
      stats.uniqueWords.add(feedback.word);

      // Add to total score and attempts
      stats.totalScore += feedback.finalMarks;
      stats.totalAttempts++;

      // Language-based grouping
      if (!stats.lessonsByLanguage[lesson.language]) {
        stats.lessonsByLanguage[lesson.language] = {
          count: 0,
          totalScore: 0
        };
      }
      stats.lessonsByLanguage[lesson.language].count++;
      stats.lessonsByLanguage[lesson.language].totalScore += feedback.finalMarks;

      stats.recentActivity.push({
        lessonId: lesson._id,
        title: lesson.title,
        language: lesson.language,
        score: feedback.finalMarks,
        timestamp: feedback.timestamp
      });
    }

    // Calculate completed lessons and average score
    stats.completedLessons = stats.uniqueLessons.size;
    if (stats.totalAttempts > 0) {
      stats.averageScore = Math.round(stats.totalScore / stats.totalAttempts);
    }

    stats.recentActivity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    stats.totalLessons = await Lesson.countDocuments();

    // Convert Sets to counts for the response
    stats.uniqueWordsCount = stats.uniqueWords.size;
    stats.uniqueLessonsCount = stats.uniqueLessons.size;

    // Remove Sets from the response
    delete stats.uniqueWords;
    delete stats.uniqueLessons;

    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching user statistics",
      error: err.message
    });
  }
};

// Add a completed lesson with the `completedAt` field
exports.completeLesson = async (req, res) => {
  const userId = req.user.id;
  const { lessonId, learnedWords } = req.body;

  try {
    // Check if the lesson was already completed
    const existingLesson = await UserLesson.findOne({ userId, lessonId });

    if (existingLesson) {
      return res.status(400).json({ message: "Lesson already completed" });
    }

    // Create a new UserLesson record with `completedAt`
    const newUserLesson = new UserLesson({
      userId,
      lessonId,
      learnedWords,
      completedAt: Date.now() // Store the date and time of completion
    });

    await newUserLesson.save();
    res.status(200).json({ message: "Lesson marked as completed", userLesson: newUserLesson });
  } catch (err) {
    res.status(500).json({ message: "Error marking lesson as completed", error: err.message });
  }
};