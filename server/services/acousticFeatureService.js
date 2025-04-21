const fs = require('fs');
const path = require('path');
const os = require('os');
const wav = require('node-wav');
const ffmpeg = require('fluent-ffmpeg');

class AcousticFeatureService {
  async extractFeatures(audioUrl) {
    let tempFilePath;
    let wavFilePath;
    try {
      // Download audio file
      tempFilePath = path.join(os.tmpdir(), `audio-${Date.now()}.webm`);
      wavFilePath = path.join(os.tmpdir(), `audio-${Date.now()}.wav`);
      await this.downloadAudio(audioUrl, tempFilePath);

      // Convert WebM to WAV using ffmpeg
      await this.convertToWav(tempFilePath, wavFilePath);

      // Read and decode WAV file
      const buffer = fs.readFileSync(wavFilePath);
      const result = wav.decode(buffer);
      
      if (!result || !result.channelData || result.channelData.length === 0) {
        throw new Error('Invalid audio data');
      }

      // Extract features from the audio data
      const features = {
        pitch: this.extractPitch(result.channelData[0], result.sampleRate),
        intensity: this.extractIntensity(result.channelData[0]),
        duration: result.channelData[0].length / result.sampleRate
      };

      // Normalize the features
      return this.normalizeFeatures(features);
    } catch (error) {
      console.error('Feature extraction error:', error);
      throw new Error('Failed to extract acoustic features');
    } finally {
      // Clean up temporary files
      [tempFilePath, wavFilePath].forEach(filePath => {
        if (filePath && fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (error) {
            console.error('Error cleaning up temporary file:', error);
          }
        }
      });
    }
  }

  async downloadAudio(url, filePath) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filePath, buffer);
  }

  convertToWav(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .toFormat('wav')
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .save(outputPath);
    });
  }

  calculateAutocorrelation(frame) {
    const result = new Float32Array(frame.length);
    for (let lag = 0; lag < frame.length; lag++) {
      let sum = 0;
      for (let i = 0; i < frame.length - lag; i++) {
        sum += frame[i] * frame[i + lag];
      }
      result[lag] = sum;
    }
    return result;
  }

  extractPitch(audioData, sampleRate) {
    const frameSize = 2048;
    const hopSize = 512;
    const minFreq = 80; // Minimum frequency to detect (Hz)
    const maxFreq = 1000; // Maximum frequency to detect (Hz)
    const silenceThreshold = 0.01; // Threshold for silence detection
    const frames = [];

    // Apply a simple high-pass filter to remove DC offset
    const filteredData = this.highPassFilter(audioData, 0.1);

    for (let i = 0; i < filteredData.length - frameSize; i += hopSize) {
      const frame = filteredData.slice(i, i + frameSize);
      
      // Check if frame is silent
      const frameEnergy = this.calculateFrameEnergy(frame);
      if (frameEnergy < silenceThreshold) {
        frames.push(0);
        continue;
      }
      
      // Apply Hanning window
      const windowedFrame = this.applyHanningWindow(frame);
      
      // Calculate autocorrelation
      const autocorr = this.calculateAutocorrelation(windowedFrame);
      
      // Find the first peak after the first zero crossing
      let peakIndex = this.findFirstPeak(autocorr, sampleRate, minFreq, maxFreq);
      
      if (peakIndex > 0) {
        // Convert peak index to frequency
        const frequency = sampleRate / peakIndex;
        frames.push(frequency);
      } else {
        frames.push(0); // No pitch detected
      }
    }

    // Remove outliers and smooth the pitch values
    return this.smoothPitchValues(frames);
  }

  calculateFrameEnergy(frame) {
    let sum = 0;
    for (let i = 0; i < frame.length; i++) {
      sum += frame[i] * frame[i];
    }
    return Math.sqrt(sum / frame.length);
  }

  highPassFilter(data, cutoff) {
    const filtered = new Float32Array(data.length);
    let prev = 0;
    for (let i = 0; i < data.length; i++) {
      filtered[i] = data[i] - prev + cutoff * filtered[i > 0 ? i - 1 : 0];
      prev = data[i];
    }
    return filtered;
  }

  applyHanningWindow(frame) {
    const windowed = new Float32Array(frame.length);
    for (let i = 0; i < frame.length; i++) {
      const multiplier = 0.5 * (1 - Math.cos(2 * Math.PI * i / (frame.length - 1)));
      windowed[i] = frame[i] * multiplier;
    }
    return windowed;
  }

  findFirstPeak(autocorr, sampleRate, minFreq, maxFreq) {
    const minLag = Math.floor(sampleRate / maxFreq);
    const maxLag = Math.floor(sampleRate / minFreq);
    
    let maxValue = 0;
    let peakIndex = 0;
    let zeroCrossingFound = false;
    
    for (let lag = minLag; lag < maxLag; lag++) {
      // Find first zero crossing
      if (!zeroCrossingFound && autocorr[lag] * autocorr[lag + 1] < 0) {
        zeroCrossingFound = true;
        continue;
      }
      
      // After zero crossing, look for peak
      if (zeroCrossingFound && autocorr[lag] > maxValue) {
        maxValue = autocorr[lag];
        peakIndex = lag;
      }
    }
    
    // Only return peak if it's significant and we found a zero crossing
    return (maxValue > 0.1 && zeroCrossingFound) ? peakIndex : 0;
  }

  smoothPitchValues(pitchValues) {
    const windowSize = 5;
    const smoothed = new Array(pitchValues.length);
    const minPitchContinuity = 0.8; // Minimum ratio of non-zero values in window
    
    for (let i = 0; i < pitchValues.length; i++) {
      let sum = 0;
      let count = 0;
      let nonZeroCount = 0;
      
      for (let j = -windowSize; j <= windowSize; j++) {
        const index = i + j;
        if (index >= 0 && index < pitchValues.length) {
          if (pitchValues[index] > 0) {
            sum += pitchValues[index];
            nonZeroCount++;
          }
          count++;
        }
      }
      
      // Only keep smoothed value if we have enough non-zero values in the window
      smoothed[i] = (nonZeroCount / count >= minPitchContinuity) ? sum / nonZeroCount : 0;
    }
    
    return smoothed;
  }

  extractIntensity(audioData) {
    // Calculate RMS (Root Mean Square) for intensity
    const frameSize = 2048;
    const hopSize = 512;
    const frames = [];
    
    for (let i = 0; i < audioData.length - frameSize; i += hopSize) {
      const frame = audioData.slice(i, i + frameSize);
      
      let sum = 0;
      for (let j = 0; j < frame.length; j++) {
        sum += frame[j] * frame[j];
      }
      const rms = Math.sqrt(sum / frame.length);
      frames.push(rms);
    }
    
    return frames;
  }

  normalizeFeatures(features) {
    // Normalize pitch values to 0-1 range, filtering out zeros
    const validPitchValues = features.pitch.filter(p => p > 0);
    const maxPitch = validPitchValues.length > 0 ? Math.max(...validPitchValues) : 1;
    const normalizedPitch = features.pitch.map(p => p > 0 ? p / maxPitch : 0);

    // Normalize intensity values to 0-1 range
    const maxIntensity = Math.max(...features.intensity);
    const normalizedIntensity = features.intensity.map(i => i / maxIntensity);

    // Normalize duration to 0-1 range (assuming max duration of 5 seconds)
    const normalizedDuration = Math.min(features.duration / 5, 1);

    return {
      pitch: normalizedPitch,
      intensity: normalizedIntensity,
      duration: normalizedDuration
    };
  }
}

module.exports = new AcousticFeatureService(); 