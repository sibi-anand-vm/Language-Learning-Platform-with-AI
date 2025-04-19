const Lesson = require("../models/Lesson");
const UserLesson=require("../models/UserLesson")
const getAllLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find();
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getLessonById = async (req, res) => {
    try {
      const lesson = await Lesson.findById(req.params.id);
      if (!lesson) return res.status(404).json({ message: "Lesson not found" });
      res.status(200).json(lesson);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};
const createLesson = async (req, res) => {
    const { title, language, difficulty, content, vocab } = req.body;
    const userId = req.user.id;
  
    try {
      
      if (!title || !language || !difficulty || !content || !vocab) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Create a new lesson
      const lesson = new Lesson({ title, language, difficulty, content, vocab });
      await lesson.save();
  
      // Create a relationship entry
      const userLesson = new UserLesson({
        userId,
        lessonId: lesson._id
      });
  
      await userLesson.save();
  
      
      res.status(201).json(lesson);
    } catch (err) {
      console.error("Error creating lesson:", err.message);
      res.status(500).json({ message: "Error creating lesson", error: err.message });
    }
  };
// Update a lesson
const updateLesson = async (req, res) => {
  try {
    const updatedLesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedLesson) return res.status(404).json({ message: "Lesson not found" });
    res.json(updatedLesson);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const deleted = await Lesson.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Lesson not found" });
    res.json({ message: "Lesson deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getAllLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
};
