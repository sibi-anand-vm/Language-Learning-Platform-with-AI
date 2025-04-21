const express = require('express');
const { evaluatePronunciation } = require('../controllers/assessmentController');

const router = express.Router();

router.post('/evaluate', evaluatePronunciation);

module.exports = router;