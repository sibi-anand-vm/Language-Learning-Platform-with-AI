const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const os = require('os');
const path = require('path');
const fetch = require('node-fetch');

async function calculatePitchIntensityMarks(audioUrl) {
  const tmpPath = path.join(os.tmpdir(), 'input-audio.mp3');

  // Download audio to /tmp
  const res = await fetch(audioUrl);
  const fileStream = fs.createWriteStream(tmpPath);
  await new Promise((resolve, reject) => {
    res.body.pipe(fileStream);
    res.body.on('error', reject);
    fileStream.on('finish', resolve);
  });

  return new Promise((resolve, reject) => {
    let volumeLevel = 0;

    ffmpeg(tmpPath)
      .audioFilters('volumedetect')
      .format('null')
      .on('stderr', (line) => {
        const match = line.match(/mean_volume: (-?\d+\.?\d*) dB/);
        if (match) {
          volumeLevel = parseFloat(match[1]);
        }
      })
      .on('end', () => {
       
        let marks;
        if (volumeLevel >= -10) marks = 100; 
else if (volumeLevel >= -20) marks = 90; 
else if (volumeLevel >= -35) marks = 80; 
else if (volumeLevel >= -45) marks = 60;
else marks = 20;

        resolve(marks);
      })
      .on('error', (err) => {
        console.error('FFmpeg error:', err);
        resolve(20); 
      })
      .saveToFile('/dev/null'); 
  });
}

module.exports = { calculatePitchIntensityMarks };
