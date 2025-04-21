const axios = require('axios');
const { logError } = require('../utils/errorLogger');

async function transcribeAudioWithAssemblyAI(audioUrl, languageCode) {
  try {
    console.log('Starting transcription for:', { audioUrl, languageCode });
    
    const apiKey = process.env.ASSEMBLYAI_API_KEY;
    if (!apiKey) {
      throw new Error('AssemblyAI API key not found in environment variables');
    }

    // Step 1: Send the audio URL to AssemblyAI for transcription
    console.log('Sending audio to AssemblyAI...');
    const response = await axios.post(
      'https://api.assemblyai.com/v2/transcript',
      {
        audio_url: audioUrl,
        language_code: languageCode, 
      },
      { 
        headers: { authorization: apiKey },
        timeout: 30000 // 30 seconds timeout
      }
    );

    const transcriptId = response.data.id;
    console.log('Received transcript ID:', transcriptId);

    // Step 2: Poll for the transcription result
    let transcript;
    let attempts = 0;
    const maxAttempts = 20; // Maximum 20 attempts (about 1 minute)

    while (!transcript || transcript.status !== 'completed') {
      if (attempts >= maxAttempts) {
        throw new Error('Transcription timeout: Maximum attempts reached');
      }

      console.log(`Polling attempt ${attempts + 1} for transcript ${transcriptId}...`);
      const result = await axios.get(
        `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
        { 
          headers: { authorization: apiKey },
          timeout: 10000 // 10 seconds timeout
        }
      );
      transcript = result.data;

      if (transcript.status === 'failed') {
        throw new Error(`Transcription failed: ${transcript.error || 'Unknown error'}`);
      }

      if (transcript.status === 'completed') {
        console.log('Transcription completed successfully');
        break;
      }

      // Wait for 3 seconds before polling again
      await new Promise(resolve => setTimeout(resolve, 3000));
      attempts++;
    }

    // Step 3: Return the transcription text
    if (!transcript.text) {
      throw new Error('No transcription text received');
    }

    console.log('Transcription result:', transcript.text);
    return transcript.text;
  } catch (error) {
    console.error('Error in transcribeAudioWithAssemblyAI:', error);
    logError('Speech-to-text error', error);
    
    // Enhance error message with more details
    if (error.response) {
      throw new Error(`AssemblyAI API error: ${error.response.status} - ${error.response.data.error || 'Unknown error'}`);
    } else if (error.request) {
      throw new Error('No response from AssemblyAI API. Please check your internet connection.');
    } else {
      throw new Error(`Transcription error: ${error.message}`);
    }
  }
}

module.exports = { transcribeAudioWithAssemblyAI };