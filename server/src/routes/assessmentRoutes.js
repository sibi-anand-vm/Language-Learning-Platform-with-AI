const express = require('express');
const { evaluatePronunciation,getFeedbacks } = require('../controllers/assessmentController');

const router = express.Router();


router.get('/feedbacks', getFeedbacks);
router.post('/evaluate', evaluatePronunciation);

module.exports = router;