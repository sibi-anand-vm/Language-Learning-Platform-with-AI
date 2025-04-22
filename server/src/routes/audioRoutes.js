const express = require('express');
const router = express.Router();
const { saveAudio,deleteAudio } = require('../controllers/audioController');

router.post('/upload',saveAudio);
router.delete("/delete/:audioId",deleteAudio);
module.exports = router;
