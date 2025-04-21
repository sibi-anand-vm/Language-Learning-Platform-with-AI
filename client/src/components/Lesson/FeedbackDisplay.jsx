import React from 'react';

export const FeedbackDisplay = ({ feedback }) => {
  if (!feedback) return null;

  return (
    <div className="mb-6 p-4 border rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Feedback</h3>
      {feedback.error ? (
        <p className="text-red-500">{feedback.error}</p>
      ) : (
        <>
          <div className="flex items-center mb-2">
            <div className="text-2xl font-bold text-indigo-600 mr-2">
              {feedback.score}%
            </div>
            <div className="text-gray-500">Accuracy</div>
          </div>
          <p className="text-gray-700">{feedback.feedback}</p>
        </>
      )}
    </div>
  );
}; 