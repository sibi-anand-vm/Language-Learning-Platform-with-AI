import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import LessonCard from '../../components/LessonCard/LessonCard';
import LessonForm from '../../components/LessonForm/LessonForm';

// Helper function to sanitize and normalize text for searching
const sanitizeText = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Replace diacritics with regular characters
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Replace special characters with spaces
    .replace(/[^a-z0-9\s]/g, ' ')
    // Replace multiple spaces with single space
    .replace(/\s+/g, ' ');
};

// Helper function for safe string comparison
const safeIncludes = (text, search) => {
  try {
    return sanitizeText(text).includes(sanitizeText(search));
  } catch (error) {
    console.error('Error in string comparison:', error);
    return false;
  }
};

const languages = ['All', 'French', 'Spanish', 'German'];
const levels = ['All', 'beginner', 'intermediate', 'advanced'];

const Lessons = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('website'); // 'website' or 'user'
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState('');
  
  // States for API data
  const [websiteLessons, setWebsiteLessons] = useState([]);
  const [userLessons, setUserLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filters, setFilters] = useState({
    language: '',
    difficulty: '',
    search: ''
  });

  // Handle search input with validation
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchError('');
    
    // Basic validation
    if (value.length > 50) {
      setSearchError('Search query is too long (maximum 50 characters)');
      return;
    }
    
    setSearchQuery(value);
  };

  // Fetch website lessons
  useEffect(() => {
    const fetchWebsiteLessons = async () => {
      if (activeTab === 'website') {
        setIsLoading(true);
        setError(null);
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('http://localhost:4008/api/lessons', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setWebsiteLessons(response.data);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch website lessons');
          alert('Error fetching website lessons:', err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchWebsiteLessons();
  }, [activeTab]);

  // Fetch user lessons
  useEffect(() => {
    const fetchUserLessons = async () => {
      if (activeTab === 'user') {
        setIsLoading(true);
        setError(null);
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('http://localhost:4008/api/user/lessons', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          // Ensure we're working with an array
          const lessons = Array.isArray(response.data) ? response.data : [];
          setUserLessons(lessons);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch user lessons');
          console.error('Error fetching user lessons:', err);
          setUserLessons([]); // Set empty array on error
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserLessons();
  }, [activeTab]);

  // Ensure currentLessons is always an array
  const currentLessons = Array.isArray(activeTab === 'website' ? websiteLessons : userLessons) 
    ? (activeTab === 'website' ? websiteLessons : userLessons)
    : [];

  const handleCreateSuccess = (newLesson) => {
    setWebsiteLessons(prev => [...prev, newLesson]);
    setShowCreateForm(false);
  };

  const filteredLessons = currentLessons.filter(lesson => {
    try {
      const lessonData = activeTab === 'website' ? lesson : lesson.lessonId || lesson;
      
      // Skip if lessonData is not valid
      if (!lessonData || typeof lessonData !== 'object') {
        return false;
      }
      
      const matchesLanguage = selectedLanguage === 'All' || 
        sanitizeText(lessonData.language) === sanitizeText(selectedLanguage);
      
      const matchesLevel = selectedLevel === 'All' || 
        sanitizeText(lessonData.difficulty) === sanitizeText(selectedLevel);
      
      const matchesSearch = !searchQuery || (
        safeIncludes(lessonData.title, searchQuery) ||
        safeIncludes(lessonData.content, searchQuery)
      );

      return matchesLanguage && matchesLevel && matchesSearch;
    } catch (error) {
      console.error('Error filtering lesson:', error, lesson);
      return false;
    }
  });

  // Loading state component
  const LoadingState = () => (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  // Error state component
  const ErrorState = () => (
    <div className="text-center py-12">
      <svg
        className="mx-auto h-12 w-12 text-red-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading lessons</h3>
      <p className="mt-1 text-sm text-gray-500">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 text-indigo-600 hover:text-indigo-500"
      >
        Try again
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Language Lessons</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create New Lesson
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('website')}
            className={`${
              activeTab === 'website'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Website Lessons
          </button>
          <button
            onClick={() => setActiveTab('user')}
            className={`${
              activeTab === 'user'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            My Lessons
          </button>
        </nav>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
          {/* Search with error handling */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search lessons..."
                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                  searchError ? 'border-red-500' : 'border-gray-300'
                }`}
                value={searchQuery}
                onChange={handleSearchChange}
                aria-invalid={!!searchError}
                aria-describedby={searchError ? "search-error" : undefined}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className={`h-5 w-5 ${searchError ? 'text-red-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            {searchError && (
              <p className="mt-1 text-sm text-red-600" id="search-error">
                {searchError}
              </p>
            )}
          </div>

          {/* Language Filter */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
          >
            {languages.map(language => (
              <option key={`language-${language}`} value={language}>
                {language === 'All' ? 'All Languages' : language}
              </option>
            ))}
          </select>

          {/* Level Filter */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
          >
            {levels.map(level => (
              <option key={`level-${level}`} value={level}>
                {level === 'All' ? 'All Levels' : level}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState />
      ) : (
        <>
          {/* Lessons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => {
              // Ensure we have a valid lesson object
              if (!lesson || typeof lesson !== 'object') return null;
              
              // Get the lesson data based on the active tab
              const lessonData = activeTab === 'website' ? lesson : lesson.lessonId || lesson;
              
              // Ensure we have a valid ID
              if (!lessonData._id) return null;
              
              // Create a unique key combining the ID and a timestamp
              const uniqueKey = `${lessonData._id}-${Date.now()}`;
              
              return (
                <LessonCard 
                  key={uniqueKey}
                  lesson={lessonData} 
                />
              );
            })}
          </div>

          {/* Empty State */}
          {filteredLessons.length === 0 && !isLoading && !error && (
            <div className="text-center py-12">
              {searchError ? (
                <>
                  <svg
                    className="mx-auto h-12 w-12 text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Invalid search</h3>
                  <p className="mt-1 text-sm text-gray-500">{searchError}</p>
                </>
              ) : (
                <>
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No lessons found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {activeTab === 'user' 
                      ? 'Create your first lesson to get started!'
                      : 'Try adjusting your search or filter criteria'}
                  </p>
                </>
              )}
            </div>
          )}
        </>
      )}

      {showCreateForm && (
        <LessonForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
};

export default Lessons; 