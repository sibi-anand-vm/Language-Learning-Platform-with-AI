import React from 'react';

export const FeedbackDisplay = ({ feedback }) => {
  if (!feedback) return <h1>After stop recording,wait for few seconds.</h1>;
  return (
    <div className="mb-6 p-6 border rounded-lg bg-white shadow-xl hover:shadow-2xl transition-shadow">
      <h3 className="text-2xl font-semibold text-gray-900 mb-4 border-b pb-2">Feedback Summary</h3>

      {feedback.error ? (
        <p className="text-red-600 font-semibold">{feedback.error}</p>
      ) : (
        <>
          <div className="flex items-center mb-4">
            <div className="text-4xl font-bold text-indigo-600 mr-4">
              {feedback.finalMarks.toFixed(2)}%
            </div>
            <div className="text-xl text-gray-600">Accuracy</div>
          </div>

          <div className="mb-4">
            <p className="text-lg font-medium text-gray-800"><strong>Word:</strong> <span className="text-indigo-700">{feedback.word}</span></p>
            <p className="text-lg font-medium text-gray-800"><strong>Transcription:</strong> <span className="text-gray-700">{feedback.transcribedText}</span></p>
            <p className="text-lg font-medium text-gray-800"><strong>Pitch & Intensity:</strong> <span className="text-green-600">{feedback.pitchIntensityMarks.toFixed(2)}%</span></p>
          </div>

          <div>
            <h4 className="text-xl font-semibold text-gray-800 mb-3">Suggestions for Improvement:</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              {feedback.feedback.map((item, index) => (
                <li key={index} className="flex items-center">
                  <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 13l4 4L14 7"></path>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};
