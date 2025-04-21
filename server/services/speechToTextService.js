const axios = require('axios');

async function transcribeAudioWithAssemblyAI(audioUrl, languageCode) {
  try {
    const apiKey = 'de4cafc32b3340da80e1c6e55580332e'; // Replace with your AssemblyAI API key

    // Step 1: Send the audio URL to AssemblyAI for transcription
    const response = await axios.post(
      'https://api.assemblyai.com/v2/transcript',
      {
        audio_url: audioUrl,
        language_code: languageCode, 
      },
      { headers: { authorization: apiKey } }
    );

    const transcriptId = response.data.id;

    // Step 2: Poll for the transcription result
    let transcript;
    while (!transcript || transcript.status !== 'completed') {
      const result = await axios.get(
        `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
        { headers: { authorization: apiKey } }
      );
      transcript = result.data;

      if (transcript.status === 'failed') {
        throw new Error('Transcription failed');
      }

      // Wait for 5 seconds before polling again
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    // Step 3: Return the transcription text
    return transcript.text;
  } catch (error) {
    console.error('Error transcribing audio with AssemblyAI:', error);
    throw new Error('Failed to transcribe audio');
  }
}

module.exports = { transcribeAudioWithAssemblyAI };