import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const LessonCard = ({ lesson }) => {
  // Determine if this is a user lesson or a website lesson
  const isUserLesson = lesson.lessonId !== undefined;
  
  // Extract lesson data based on the structure
  const lessonData = isUserLesson ? lesson.lessonId : lesson;
  const lessonId = isUserLesson ? lesson.lessonId._id : lesson._id;
  
  // Extract other properties
  const {
    title,
    language,
    difficulty,
    content,
    vocab,
    steps
  } = lessonData;

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-4xl">
            {language === 'French' ? '🇫🇷' : 
             language === 'Spanish' ? '🇪🇸' : 
             language === 'German' ? '🇩🇪' : '🌐'}
          </span>
          <span className="text-sm font-medium text-gray-500">
            {vocab?.length || 0} words
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{content}</p>

        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            {difficulty}
          </span>
          <span className="text-sm text-gray-500">{language}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {steps?.length || 0} steps
          </div>
          <Link
            to={`/lessons/${lessonId}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Start Lesson
          </Link>
        </div>
      </div>
    </div>
  );
};

LessonCard.propTypes = {
  lesson: PropTypes.oneOfType([
    // Website lesson structure
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      language: PropTypes.string.isRequired,
      difficulty: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      vocab: PropTypes.arrayOf(
        PropTypes.shape({
          word: PropTypes.string.isRequired,
          translation: PropTypes.string.isRequired,
          _id: PropTypes.string.isRequired
        })
      ),
      steps: PropTypes.array
    }),
    // User lesson structure
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      userId: PropTypes.string.isRequired,
      lessonId: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        language: PropTypes.string.isRequired,
        difficulty: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        vocab: PropTypes.arrayOf(
          PropTypes.shape({
            word: PropTypes.string.isRequired,
            translation: PropTypes.string.isRequired,
            _id: PropTypes.string.isRequired
          })
        ),
        steps: PropTypes.array
      }).isRequired
    })
  ]).isRequired
};

export default LessonCard;
