import axios from 'axios';

function validateFeedbackRequestData(data) {
  if (!data || !data.audioUrl || !data.word || !data.language) {
    throw new Error('Invalid feedback request data');
  }
}
const API_URL = 'https://language-learning-platform-with-ai-40z4.onrender.com/api';
function getAuthHeader() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found. Please log in again.');
  }
  return { Authorization: `Bearer ${token}` };
}

// Error handling function
function handleApiError(error) {
  console.error('API Error:', error);
  
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    if (error.response.status === 401 || error.response.status === 403) {
      // Clear the invalid token and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      throw new Error('Your session has expired. Please log in again.');
    }
    throw new Error(error.response.data.error || 'An error occurred while processing your request');
  } else if (error.request) {
    // The request was made but no response was received
    throw new Error('No response from server. Please try again later.');
  } else {
    // Something happened in setting up the request that triggered an Error
    throw new Error(error.message || 'An error occurred while processing your request');
  }
}

const FeedbackService = {
  async generateFeedback({ audioUrl, word, language, lessonId }) {
    try {
      // Validate required fields
      if (!audioUrl || !word || !language || !lessonId) {
        throw new Error('Missing required fields: audioUrl, word, language, and lessonId are required');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(
        `${API_URL}/assessment/evaluate`,
        {
          audioUrl,
          word,
          language,
          lessonId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw this.handleApiError(error);
    }
  },

  async getFeedback(id) {
    try {
      const headers = getAuthHeader();
      const response = await axios({
        method: 'GET',
        url: `https://language-learning-platform-with-ai-40z4.onrender.com/api/assessment/feedback/${id}`,
        headers
      });

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }
};

export default FeedbackService;
