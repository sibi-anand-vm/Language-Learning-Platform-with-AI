function generateFeedback(accuracyMarks, pitchIntensityMarks) {
    let feedback = [];
  
    // Accuracy Feedback
    if (accuracyMarks >= 90) {
      feedback.push("Great job! Your pronunciation is very accurate.");
    } else if (accuracyMarks >= 70) {
      feedback.push("Good effort! Focus on enunciating the word more precisely.");
    } else {
      feedback.push("Your pronunciation needs improvement. Practice breaking the word into syllables.");
    }
  
    // Pitch & Intensity Feedback
    if (pitchIntensityMarks >= 80) {
      feedback.push("Your pitch and intensity are excellent! Keep it up.");
    } else if (pitchIntensityMarks >= 60) {
      feedback.push("Your pitch and intensity are good, but try to add more emphasis.");
    } else {
      feedback.push("Work on your pitch and intensity. Mimic the tone and stress of the original word.");
    }
  
    return feedback;
  }
  
  module.exports = { generateFeedback };
  