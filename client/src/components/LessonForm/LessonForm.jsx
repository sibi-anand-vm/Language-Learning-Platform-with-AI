import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const LessonForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    language: 'French',
    difficulty: 'beginner',
    content: '',
    vocab: [{ word: '', translation: '' }]
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const languages = ['French', 'Spanish', 'German', 'English', 'Chinese'];
  const difficulties = ['beginner', 'intermediate', 'advanced'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVocabChange = (index, field, value) => {
    const newVocab = [...formData.vocab];
    newVocab[index] = {
      ...newVocab[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      vocab: newVocab
    }));
  };

  const addVocabItem = () => {
    setFormData(prev => ({
      ...prev,
      vocab: [...prev.vocab, { word: '', translation: '' }]
    }));
  };

  const removeVocabItem = (index) => {
    if (formData.vocab.length > 1) {
      setFormData(prev => ({
        ...prev,
        vocab: prev.vocab.filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    formData.vocab.forEach((item, index) => {
      if (!item.word.trim()) {
        newErrors[`vocab_word_${index}`] = 'Word is required';
      }
      if (!item.translation.trim()) {
        newErrors[`vocab_translation_${index}`] = 'Translation is required';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:4008/api/lessons', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      onSuccess(response.data);
      onClose();
    } catch (err) {
      setErrors({
        submit: err.response?.data?.message || 'Failed to create lesson'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create New Lesson</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>
            
            {/* Language and Difficulty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                  Language
                </label>
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {difficulties.map(diff => (
                    <option key={diff} value={diff}>{diff}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                rows={4}
                value={formData.content}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.content ? 'border-red-500' : 'border-gray-300'
                } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content}</p>
              )}
            </div>
            
            {/* Vocabulary */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Vocabulary
                </label>
                <button
                  type="button"
                  onClick={addVocabItem}
                  className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Word
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.vocab.map((item, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Word"
                        value={item.word}
                        onChange={(e) => handleVocabChange(index, 'word', e.target.value)}
                        className={`block w-full rounded-md border ${
                          errors[`vocab_word_${index}`] ? 'border-red-500' : 'border-gray-300'
                        } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                      />
                      {errors[`vocab_word_${index}`] && (
                        <p className="mt-1 text-xs text-red-600">{errors[`vocab_word_${index}`]}</p>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Translation"
                        value={item.translation}
                        onChange={(e) => handleVocabChange(index, 'translation', e.target.value)}
                        className={`block w-full rounded-md border ${
                          errors[`vocab_translation_${index}`] ? 'border-red-500' : 'border-gray-300'
                        } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                      />
                      {errors[`vocab_translation_${index}`] && (
                        <p className="mt-1 text-xs text-red-600">{errors[`vocab_translation_${index}`]}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVocabItem(index)}
                      className="inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {errors.submit && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{errors.submit}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create Lesson'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

LessonForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired
};

export default LessonForm; 