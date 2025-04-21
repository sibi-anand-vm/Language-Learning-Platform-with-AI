const axios = require('axios');
const AcousticFeatureService = require('./acousticFeatureService');
const { logError } = require('../utils/errorLogger');

class PronunciationAnalysisService {
  constructor() {
    this.languageModels = {
      'en': {
        pitch: { min: 80, max: 300 },
        intensity: { min: 0.3, max: 1.0 },
        duration: { min: 0.1, max: 0.5 },
        characteristics: ['rhotic', 'clear vowel sounds', 'stress-timed']
      },
      'en-US': {
        pitch: { min: 80, max: 300 },
        intensity: { min: 0.3, max: 1.0 },
        duration: { min: 0.1, max: 0.5 },
        characteristics: ['rhotic', 'clear vowel sounds', 'stress-timed']
      },
      'en-GB': {
        pitch: { min: 80, max: 300 },
        intensity: { min: 0.3, max: 1.0 },
        duration: { min: 0.1, max: 0.5 },
        characteristics: ['non-rhotic', 'received pronunciation', 'stress-timed']
      },
      'es': {
        pitch: { min: 100, max: 350 },
        intensity: { min: 0.4, max: 1.0 },
        duration: { min: 0.1, max: 0.6 },
        characteristics: ['syllable-timed', 'clear consonants', 'distinct vowels']
      },
      'fr': {
        pitch: { min: 90, max: 320 },
        intensity: { min: 0.35, max: 1.0 },
        duration: { min: 0.1, max: 0.55 },
        characteristics: ['nasal vowels', 'liaison', 'stress on final syllable']
      }
    };
  }

  async analyzePronunciation(audioUrl, word, language = 'en') {
    try {
      // Normalize language code
      const normalizedLanguage = this.normalizeLanguageCode(language);
      
      // Extract acoustic features
      const features = await AcousticFeatureService.extractFeatures(audioUrl);
      
      // Check if there's any voice
      if (!this.hasVoice(features)) {
        return {
          score: 0,
          feedback: "No voice detected. Please speak clearly.",
          features: features,
          languageCharacteristics: this.languageModels[normalizedLanguage]?.characteristics || []
        };
      }

      // Get language model
      const model = this.languageModels[normalizedLanguage];
      if (!model) {
        throw new Error(`Language model not found for ${language}`);
      }

      // Analyze features
      const analysis = this.analyzeFeatures(features, model);
      
      // Generate feedback
      const feedback = this.generateFeedback(analysis, model);
      
      return {
        score: analysis.score,
        feedback: feedback,
        features: features,
        languageCharacteristics: model.characteristics
      };
    } catch (error) {
      logError('Pronunciation analysis error', error);
      throw new Error('Failed to analyze pronunciation');
    }
  }

  hasVoice(features) {
    // Check if there's significant intensity (voice activity)
    const hasIntensity = features.intensity.some(i => i > 0.1);
    
    // Check if there's any pitch detected
    const hasPitch = features.pitch.some(p => p > 0);
    
    // Check if duration is reasonable
    const hasReasonableDuration = features.duration > 0.1 && features.duration < 5.0;
    
    return hasIntensity && hasPitch && hasReasonableDuration;
  }

  analyzeFeatures(features, model) {
    // Calculate pitch score
    const pitchScore = this.calculatePitchScore(features.pitch, model.pitch);
    
    // Calculate intensity score
    const intensityScore = this.calculateIntensityScore(features.intensity, model.intensity);
    
    // Calculate duration score
    const durationScore = this.calculateDurationScore(features.duration, model.duration);
    
    // Calculate overall score (weighted average)
    const score = (
      pitchScore * 0.4 +    // Pitch contributes 40%
      intensityScore * 0.3 + // Intensity contributes 30%
      durationScore * 0.3    // Duration contributes 30%
    ) * 100; // Convert to percentage
    
    return {
      score,
      pitchScore: pitchScore * 100,
      intensityScore: intensityScore * 100,
      durationScore: durationScore * 100
    };
  }

  calculatePitchScore(pitchValues, pitchModel) {
    const validPitchValues = pitchValues.filter(p => p > 0);
    if (validPitchValues.length === 0) return 0;
    
    // Calculate average pitch in Hz
    const avgPitch = validPitchValues.reduce((sum, p) => sum + p, 0) / validPitchValues.length;
    
    // Check if average pitch is within target range
    if (avgPitch >= pitchModel.min && avgPitch <= pitchModel.max) {
      // Calculate how close to the middle of the range
      const middle = (pitchModel.min + pitchModel.max) / 2;
      const distanceFromMiddle = Math.abs(avgPitch - middle);
      const maxDistance = (pitchModel.max - pitchModel.min) / 2;
      
      // Score based on distance from middle (closer is better)
      return 1 - (distanceFromMiddle / maxDistance);
    }
    
    // If outside range, calculate penalty
    const distance = Math.min(
      Math.abs(avgPitch - pitchModel.min),
      Math.abs(avgPitch - pitchModel.max)
    );
    const range = pitchModel.max - pitchModel.min;
    return Math.max(0, 1 - (distance / range));
  }

  calculateIntensityScore(intensityValues, intensityModel) {
    const avgIntensity = intensityValues.reduce((sum, i) => sum + i, 0) / intensityValues.length;
    
    // Check if average intensity is within target range
    if (avgIntensity >= intensityModel.min && avgIntensity <= intensityModel.max) {
      // Calculate how close to the middle of the range
      const middle = (intensityModel.min + intensityModel.max) / 2;
      const distanceFromMiddle = Math.abs(avgIntensity - middle);
      const maxDistance = (intensityModel.max - intensityModel.min) / 2;
      
      // Score based on distance from middle (closer is better)
      return 1 - (distanceFromMiddle / maxDistance);
    }
    
    // If outside range, calculate penalty
    const distance = Math.min(
      Math.abs(avgIntensity - intensityModel.min),
      Math.abs(avgIntensity - intensityModel.max)
    );
    const range = intensityModel.max - intensityModel.min;
    return Math.max(0, 1 - (distance / range));
  }

  calculateDurationScore(duration, durationModel) {
    // Check if duration is within target range
    if (duration >= durationModel.min && duration <= durationModel.max) {
      // Calculate how close to the middle of the range
      const middle = (durationModel.min + durationModel.max) / 2;
      const distanceFromMiddle = Math.abs(duration - middle);
      const maxDistance = (durationModel.max - durationModel.min) / 2;
      
      // Score based on distance from middle (closer is better)
      return 1 - (distanceFromMiddle / maxDistance);
    }
    
    // If outside range, calculate penalty
    const distance = Math.min(
      Math.abs(duration - durationModel.min),
      Math.abs(duration - durationModel.max)
    );
    const range = durationModel.max - durationModel.min;
    return Math.max(0, 1 - (distance / range));
  }

  generateFeedback(analysis, model) {
    const feedback = [];
    
    // Pitch feedback
    if (analysis.pitchScore < 60) {
      feedback.push("Try to maintain a more consistent pitch.");
    }
    
    // Intensity feedback
    if (analysis.intensityScore < 60) {
      feedback.push("Speak with more clarity and volume.");
    }
    
    // Duration feedback
    if (analysis.durationScore < 60) {
      feedback.push("Try to maintain a more natural speaking pace.");
    }
    
    // Overall feedback
    if (analysis.score > 80) {
      feedback.unshift("Excellent pronunciation!");
    } else if (analysis.score > 60) {
      feedback.unshift("Good pronunciation, but could use some improvement.");
    } else {
      feedback.unshift("Needs more practice. Focus on the following:");
    }
    
    return feedback.join(' ');
  }

  normalizeLanguageCode(language) {
    // Convert to lowercase and remove any spaces
    const normalized = language.toLowerCase().trim();
    
    // If it's a regional variant (e.g., en-US), check if we have that specific model
    if (this.languageModels[normalized]) {
      return normalized;
    }
    
    // If not, try to get the base language (e.g., 'en' from 'en-US')
    const baseLanguage = normalized.split('-')[0];
    if (this.languageModels[baseLanguage]) {
      return baseLanguage;
    }
    
    // Default to English if no matching model found
    return 'en';
  }
}

module.exports = new PronunciationAnalysisService(); 