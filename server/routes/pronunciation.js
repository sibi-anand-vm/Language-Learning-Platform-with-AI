const express = require('express');
const pronunciationAnalysisService = require('../services/pronunciationAnalysisService');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Input validation
const validateInput = [
  body('audioUrl')
    .isURL()
    .withMessage('Valid audio URL required'),
  body('word')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Word is required'),
  body('language')
    .isString()
    .trim()
    .notEmpty()
    .matches(/^[a-z]{2}(-[A-Z]{2})?$/)
    .withMessage('Valid language code required (e.g., en or en-US)')
];

router.post('/analyze', limiter, validateInput, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { audioUrl, word, language } = req.body;

    const analysis = await pronunciationAnalysisService.analyzePronunciation(
      audioUrl,
      word,
      language
    );

    res.json(analysis);
  } catch (error) {
    console.error('Pronunciation analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze pronunciation',
      details: error.message 
    });
  }
});

module.exports = router; 