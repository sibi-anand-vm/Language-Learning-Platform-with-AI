import React from 'react';

export const WordDisplay = ({ word, translation, currentIndex, totalWords }) => (
  <div className="mb-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-gray-900">
        Word {currentIndex + 1} of {totalWords}
      </h2>
      <div className="text-sm text-gray-500">
        {Math.round((currentIndex + 1) / totalWords * 100)}% Complete
      </div>
    </div>
    
    <div className="text-center mb-8">
      <div className="text-4xl font-bold text-indigo-600 mb-2">
        {word}
      </div>
      <div className="text-xl text-gray-500">
        {translation}
      </div>
    </div>
  </div>
); 