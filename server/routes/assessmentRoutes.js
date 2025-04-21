const express = require('express');
const { transcribeAudioWithAssemblyAI } = require('../services/speechToTextService');
const { calculatePitchIntensityMarks } = require('../services/pitchIntensityService');
const { calculateAccuracy } = require('../utils/accuracyUtils');
const { generateFeedback } = require('../utils/feedbackUtils');

const router = express.Router();

router.post('/evaluate', async (req, res) => {
  const { audioUrl, word, language } = req.body;

  if (!audioUrl || !word || !language) {
    return res.status(400).json({ error: 'audioUrl, word, and language are required' });
  }

  try {
    // Step 1: Transcribe the audio using AssemblyAI
    const transcribedText = await transcribeAudioWithAssemblyAI(audioUrl);

    // Step 2: Compare the original word with the transcribed text
    const accuracyMarks = calculateAccuracy(word, transcribedText);

    // Step 3: Calculate pitch and intensity marks
    const pitchIntensityMarks = await calculatePitchIntensityMarks(audioUrl);

    // Step 4: Combine the scores
    const finalMarks = (accuracyMarks * 0.6) + (pitchIntensityMarks * 0.4);

    // Step 5: Generate feedback
    const feedback = generateFeedback(accuracyMarks, pitchIntensityMarks);

    // Step 6: Return the result
    res.json({
      word,
      transcribedText,
      accuracyMarks,
      pitchIntensityMarks,
      finalMarks,
      feedback,
    });
  } catch (error) {
    console.error('Error evaluating audio:', error);
    res.status(500).json({ error: 'Failed to evaluate audio' });
  }
});

module.exports = router;