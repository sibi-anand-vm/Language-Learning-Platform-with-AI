import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';
import { lessonService } from '../../services/api/lessonService';
import { LessonHeader } from '../../components/Lesson/LessonHeader';
import { WordDisplay } from '../../components/Lesson/WordDisplay';
import { RecordingControls } from '../../components/Lesson/RecordingControls';
import { AudioPlayer } from '../../components/Lesson/AudioPlayer';
import { FeedbackDisplay } from '../../components/Lesson/FeedbackDisplay';
import { NavigationButtons } from '../../components/Lesson/NavigationButtons';
import { ResultsScreen } from '../../components/Lesson/ResultsScreen';
import FeedbackService from '../../services/api/FeedbackService';

const Lesson = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [recordings, setRecordings] = useState({});
  const [feedback, setFeedback] = useState({});
  const [fbState,setfbState] = useState('No feedback yet');
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

  const {
    isRecording,
    startRecording,
    stopRecording,
  } = useAudioRecorder((audioUrl) => {
    setRecordings(prev => ({
      ...prev,
      [currentWordIndex]: audioUrl,
    }));
  });

  // Memoized function to generate feedback
  const generateFeedback = useCallback(async (audioUrl, word, language) => {
    if (!audioUrl || !word || !language) return;
    
    setIsGeneratingFeedback(true);
    setError(null);
    setfbState('Generating feedback...');
    
    try {
      const feedbackData = await FeedbackService.generateFeedback({
        audioUrl,
        word,
        language,
      });
      
      setFeedback(prev => ({
        ...prev,
        [currentWordIndex]: feedbackData,
      }));
      setfbState('Feedback generated successfully');
    } catch (err) {
      setError(err.message || 'Failed to generate feedback');
      setfbState('Error generating feedback');
    } finally {
      setIsGeneratingFeedback(false);
    }
  }, [currentWordIndex]);

  // Handle recording completion
  const handleRecordingComplete = useCallback(async (audioUrl) => {
    if (!lesson || !audioUrl) return;
    
    const currentWord = lesson.vocab[currentWordIndex];
    await generateFeedback(audioUrl, currentWord.word, lesson.language);
  }, [lesson, currentWordIndex, generateFeedback]);

  // Effect to handle new recordings
  useEffect(() => {
    if (recordings[currentWordIndex]) {
      handleRecordingComplete(recordings[currentWordIndex]);
    }
  }, [recordings[currentWordIndex], handleRecordingComplete]);

  // Effect to reset feedback state when changing words
  useEffect(() => {
    setfbState('No feedback yet');
  }, [currentWordIndex]);

  // Fetch lesson data
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const lessonData = await lessonService.getLesson(id);
        setLesson(lessonData);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch lesson');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLesson();
  }, [id]);

  const handlePrevious = () => {
    setCurrentWordIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    if (currentWordIndex < lesson.vocab.length - 1) {
      setCurrentWordIndex((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    if (!feedback || Object.keys(feedback).length === 0) return 0;
    
    const scores = Object.values(feedback)
      .filter(f => f && f.finalMarks !== undefined)
      .map(f => f.finalMarks);
    
    if (scores.length === 0) return 0;
    
    const average = scores.reduce((acc, score) => acc + score, 0) / scores.length;
    return Math.round(average);
  };

  if (isLoading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  if (!lesson) return null;

  const currentWord = lesson.vocab[currentWordIndex];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <LessonHeader 
          title={lesson.title}
          language={lesson.language}
          difficulty={lesson.difficulty}
        />

        {!showResults ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <WordDisplay
              word={currentWord.word}
              translation={currentWord.translation}
              currentIndex={currentWordIndex}
              totalWords={lesson.vocab.length}
            />

            <RecordingControls
              isRecording={isRecording}
              onStartRecording={() => startRecording(currentWordIndex)}
              onStopRecording={stopRecording}
              disabled={isGeneratingFeedback}
            />

            <AudioPlayer audioUrl={recordings[currentWordIndex]} />
            <FeedbackDisplay 
              feedback={feedback[currentWordIndex]} 
              isLoading={isGeneratingFeedback}
              state={fbState}
            />

            <NavigationButtons
              onPrevious={handlePrevious}
              onNext={handleNext}
              isFirstWord={currentWordIndex === 0}
              isLastWord={currentWordIndex === lesson.vocab.length - 1}
              disabled={isGeneratingFeedback}
            />
          </div>
        ) : (
          <ResultsScreen
            score={calculateScore()}
            vocab={lesson.vocab}
            feedback={feedback}
            recordings={recordings}
            onBackToDashboard={() => navigate('/dashboard')}
          />
        )}
      </div>
    </div>
  );
};

export default Lesson;
