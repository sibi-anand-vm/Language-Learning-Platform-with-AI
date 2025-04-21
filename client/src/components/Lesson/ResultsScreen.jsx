import React from 'react';

export const ResultsScreen = ({ score, vocab, feedback, recordings, onBackToDashboard }) => (
  <div className="bg-white rounded-lg shadow-lg p-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Lesson Complete!</h2>
    <div className="text-center mb-8">
      <div className="text-4xl font-bold text-indigo-600 mb-2">
        {score}%
      </div>
      <p className="text-gray-500">Your Pronunciation Score</p>
    </div>

    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Review</h3>
      {vocab.map((word, index) => (
        <div key={word._id} className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h4 className="font-medium text-lg">{word.word}</h4>
              <p className="text-gray-500">{word.translation}</p>
            </div>
            {feedback[index] && !feedback[index].error && (
              <div className="text-indigo-600 font-medium">
                {feedback[index].score}%
              </div>
            )}
          </div>
          
          {recordings[index] && (
            <div className="mt-2">
              <audio src={recordings[index]} controls className="w-full" />
            </div>
          )}
          
          {feedback[index] && !feedback[index].error && (
            <div className="mt-2 text-sm text-gray-600">
              {feedback[index].feedback}
            </div>
          )}
        </div>
      ))}
    </div>

    <div className="mt-6 flex justify-center">
      <button
        onClick={onBackToDashboard}
        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Back to Dashboard
      </button>
    </div>
  </div>
); 