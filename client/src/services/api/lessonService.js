import axios from 'axios';

const API_URL = 'http://localhost:4008/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const validateLessonId = (id) => {
  if (!id || typeof id !== 'string') {
    throw new Error('Invalid lesson ID');
  }
};

const validatePronunciationParams = (audioUrl, word, language) => {
  if (!audioUrl || typeof audioUrl !== 'string') {
    throw new Error('Invalid audio URL');
  }
  if (!word || typeof word !== 'string') {
    throw new Error('Invalid word');
  }
  if (!language || typeof language !== 'string') {
    throw new Error('Invalid language code');
  }
  // Validate language code format (xx-XX)
  if (!/^[a-z]{2}-[A-Z]{2}$/.test(language)) {
    throw new Error('Invalid language code format. Use format: xx-XX (e.g., en-US)');
  }
};

const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    switch (status) {
      case 400:
        throw new Error(data.message || 'Invalid request parameters');
      case 401:
        throw new Error('Unauthorized access. Please login again');
      case 404:
        throw new Error('Resource not found');
      case 429:
        throw new Error('Too many requests. Please try again later');
      case 500:
        throw new Error('Server error. Please try again later');
      default:
        throw new Error(data.message || 'An error occurred');
    }
  } else if (error.request) {
    // Request was made but no response received
    throw new Error('No response from server. Please check your connection');
  } else {
    // Error in request setup
    throw new Error('Request setup error');
  }
};

const lessonService = {
  async getLesson(id) {
    try {
      validateLessonId(id);
      const response = await axios.get(`${API_URL}/lessons/${id}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  async analyzePronunciation(audioUrl, word, language) {
    try {
      validatePronunciationParams(audioUrl, word, language);
      const response = await axios.post(
        `${API_URL}/pronunciation/analyze`,
        { audioUrl, word, language },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};

export { lessonService }; 