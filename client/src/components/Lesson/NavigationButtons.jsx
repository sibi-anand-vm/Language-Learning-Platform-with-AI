import React from 'react';

export const NavigationButtons = ({ 
  onPrevious, 
  onNext, 
  isFirstWord, 
  isLastWord 
}) => (
  <div className="mt-6 flex justify-between">
    <button
      onClick={onPrevious}
      disabled={isFirstWord}
      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Previous
    </button>
    <button
      onClick={onNext}
      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      {isLastWord ? 'Finish' : 'Next'}
    </button>
  </div>
); 