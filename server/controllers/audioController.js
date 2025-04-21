const Audio = require('../models/Audio');
const User = require('../models/User');
const Lesson = require('../models/Lesson');

const saveAudio = async (req, res) => {
  const { lessonId, audioUrl, score } = req.body;

  const lesson = await Lesson.findById(lessonId);
  const user = await User.findById(req.user.id);

  if (!lesson || !user) {
    return res.status(400).json({ message: "Invalid lesson or user" });
  }

  try {
    const audio = new Audio({
      userId: user._id,
      lessonId: lesson._id,
      audioUrl: audioUrl,
      score: score,
    });

    await audio.save();
    res.status(201).json({ message: "Audio saved successfully", audio });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteAudio = async (req, res) => {
    const audioId = req.params.audioId;
  
    try {
      // Find the audio by its ID
      const audio = await Audio.findById(audioId);
  
      if (!audio) {
        return res.status(404).json({ message: "Audio not found" });
      }
  
    
      if (audio.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: "You are not authorized to delete this audio" });
      }
      /*
      if (audio.audioUrl) {
        const publicId = audio.audioUrl.split("/").pop().split(".")[0]; // Extract the public ID from the URL
        await cloudinary.uploader.destroy(publicId);
      }
 */
      await Audio.findByIdAndDelete(audioId);
  
      res.status(200).json({ message: "Audio deleted successfully" });
    } catch (err) {
   
      res.status(500).json({ message: "Server error, unable to delete audio" });
    }
  };
  
  module.exports = {saveAudio, deleteAudio };