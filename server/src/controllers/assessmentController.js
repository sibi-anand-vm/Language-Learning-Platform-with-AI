const { transcribeAudioWithAssemblyAI } = require('../services/speechToTextService');
const { calculatePitchIntensityMarks } = require('../services/pitchIntensityService');
const { logError } = require('../utils/errorLogger');
const Assessment = require('../models/Assessment');



async function getFeedbacks(req,res){
  try{
    const feedbacks = await Assessment.find({userId:req.user.id});
    res.json(feedbacks);
  }catch(error){
    logError('Error fetching feedbacks',error);
    res.status(500).json({error:'Failed to fetch feedbacks'});
  }
}


async function evaluatePronunciation(req, res) {
  try {
    console.log('Received assessment request:', {
      audioUrl: req.body.audioUrl,
      word: req.body.word,
      language: req.body.language,
      lessonId: req.body.lessonId
    });

    const { audioUrl, word, language, lessonId } = req.body;

    if (!audioUrl || !word || !language || !lessonId) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: {
          audioUrl: !audioUrl,
          word: !word,
          language: !language,
          lessonId: !lessonId
        }
      });
    }

    // Step 1: Calculate pitch and intensity
    let pitchIntensityMarks;
    try {
      pitchIntensityMarks = await calculatePitchIntensityMarks(audioUrl);
      if (pitchIntensityMarks < 45) {
        const noVoiceFeedback = {
          word,
          transcribedText: '',
          accuracyMarks: 0,
          pitchIntensityMarks,
          finalMarks: 0,
          feedback: ['No voice detected. Please speak clearly and try again.']
        };

        await Assessment.create({
          userId: req.user.id,
          lessonId,
          ...noVoiceFeedback
        });

        return res.status(200).json(noVoiceFeedback);
      }
    } catch (pitchError) {
      throw new Error(`Pitch analysis failed: ${pitchError.message}`);
    }

    // Step 2: Transcribe audio
    let transcribedText;
    try {
      transcribedText = await transcribeAudioWithAssemblyAI(audioUrl, language);
      if (!transcribedText || transcribedText.trim().length === 0) {
        const noVoiceFeedback = {
          word,
          transcribedText: '',
          accuracyMarks: 0,
          pitchIntensityMarks,
          finalMarks: 0,
          feedback: ['No voice detected. Please speak clearly and try again.']
        };

        await Assessment.create({
          userId: req.user.id,
          lessonId,
          ...noVoiceFeedback
        });

        return res.status(200).json(noVoiceFeedback);
      }
    } catch (transcriptionError) {
      throw new Error(`Transcription failed: ${transcriptionError.message}`);
    }

    // Step 3: Accuracy calculation
    const accuracyMarks = calculateAccuracyMarks(transcribedText, word);

    // Step 4: Final score
    const finalMarks = (accuracyMarks * 0.6) + (pitchIntensityMarks * 0.4);

    // Step 5: Feedback
    const feedback = generateFeedback(accuracyMarks, pitchIntensityMarks);

    const response = {
      word,
      transcribedText,
      accuracyMarks,
      pitchIntensityMarks,
      finalMarks,
      feedback
    };

    await Assessment.create({
      userId: req.user.id,
      lessonId,
      ...response
    });

    res.json(response);

  } catch (error) {
    logError('Assessment error', error);
    res.status(500).json({ 
      error: 'Failed to evaluate pronunciation',
      message: error.message
    });
  }
}

function calculateAccuracyMarks(transcribedText, expectedWord) {
  const transcribed = transcribedText.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
  const expected = expectedWord.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
  const distance = levenshteinDistance(transcribed, expected);
  const maxLength = Math.max(transcribed.length, expected.length);
  const accuracy = ((maxLength - distance) / maxLength) * 100;
  return accuracy;
}

function levenshteinDistance(a, b) {
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + substitutionCost
      );
    }
  }
  return matrix[b.length][a.length];
}

function generateFeedback(accuracyMarks, pitchIntensityMarks) {
  const feedback = [];

  if (accuracyMarks < 70) {
    feedback.push("Focus on enunciating the word more precisely.");
  } else if (accuracyMarks < 85) {
    feedback.push("Good effort! Try to match the pronunciation more closely.");
  } else {
    feedback.push("Excellent pronunciation accuracy!");
  }

  if (pitchIntensityMarks < 70) {
    feedback.push("Try to speak with more clarity and volume.");
  } else if (pitchIntensityMarks < 85) {
    feedback.push("Your pitch and intensity are good, but could be more consistent.");
  } else {
    feedback.push("Your pitch and intensity are excellent! Keep it up.");
  }

  return feedback;
}

module.exports = {
  getFeedbacks,
  evaluatePronunciation
};
