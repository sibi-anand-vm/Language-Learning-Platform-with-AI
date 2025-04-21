import React from 'react';

export const LessonHeader = ({ title, language, difficulty }) => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
    <div className="flex items-center space-x-4 text-sm text-gray-500">
      <span>{language}</span>
      <span>•</span>
      <span>{difficulty}</span>
    </div>
  </div>
); 