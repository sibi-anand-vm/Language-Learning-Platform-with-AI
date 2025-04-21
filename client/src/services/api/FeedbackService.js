import axios from 'axios';

function validateFeedbackRequestData(data) {
  if (!data || !data.audioUrl || !data.word || !data.language) {
    throw new Error('Invalid feedback request data');
  }
}

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
  async generateFeedback({ audioUrl, word, language }) {
    try {
      validateFeedbackRequestData({ audioUrl, word, language });
      const headers = getAuthHeader();

      const response = await axios({
        method: 'POST',
        url: 'http://localhost:4008/api/assessment/evaluate',
        data: { audioUrl, word, language },
        headers
      });

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  async getFeedback(id) {
    try {
      const headers = getAuthHeader();
      const response = await axios({
        method: 'GET',
        url: `http://localhost:4008/api/assessment/feedback/${id}`,
        headers
      });

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }
};

export default FeedbackService;
