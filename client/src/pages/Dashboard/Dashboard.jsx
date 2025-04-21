import React from 'react';
import { useAuth } from '../../hooks/useAuth';

// Placeholder data (will be replaced with real data from API)
const progressData = {
  lessonsCompleted: 12,
  totalLessons: 30,
  averageScore: 85,
  streak: 7
};

const recentLessons = [
  { id: 1, title: 'Basic Greetings', language: 'Spanish', score: 90, date: '2024-02-20' },
  { id: 2, title: 'Numbers 1-20', language: 'French', score: 85, date: '2024-02-19' },
  { id: 3, title: 'Common Phrases', language: 'German', score: 78, date: '2024-02-18' }
];

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.username || 'Learner'}!
          </h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              🔥 {progressData.streak} Day Streak
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Lessons Completed
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {progressData.lessonsCompleted}/{progressData.totalLessons}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Average Score
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {progressData.averageScore}%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Study Time
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      2.5h
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Words Learned
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      156
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recent Lessons
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentLessons.map((lesson) => (
            <div key={lesson.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-600 font-medium">
                        {lesson.language.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-indigo-600">
                      {lesson.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {lesson.language}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-sm text-gray-900 mr-4">
                    Score: {lesson.score}%
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(lesson.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="bg-indigo-600 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <h3 className="text-lg font-medium text-white truncate">
                  Practice Pronunciation
                </h3>
                <p className="mt-1 text-sm text-indigo-100">
                  Start a new pronunciation session
                </p>
              </div>
            </div>
            <div className="mt-4">
              <button className="bg-white text-indigo-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-50 transition-colors">
                Start Practice
              </button>
            </div>
          </div>
        </div>

        <div className="bg-green-600 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <h3 className="text-lg font-medium text-white truncate">
                  New Lesson
                </h3>
                <p className="mt-1 text-sm text-green-100">
                  Start your next language lesson
                </p>
              </div>
            </div>
            <div className="mt-4">
              <button className="bg-white text-green-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-green-50 transition-colors">
                Begin Lesson
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard; 