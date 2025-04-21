import React, { useEffect, useState } from 'react';
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

const Lesson = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [recordings, setRecordings] = useState({});

  const {
    isRecording,
    feedback,
    startRecording,
    stopRecording,
  } = useAudioRecorder((audioUrl) => {
    setRecordings(prev => ({
      ...prev,
      [currentWordIndex]: audioUrl,
    }));
  });

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
      .filter(f => f && f.score !== undefined)
      .map(f => f.score);
    
    if (scores.length === 0) return 0;
    
    const average = scores.reduce((acc, score) => acc + score, 0) / scores.length;
    return Math.round(average);
  };

  const handleRecordingComplete = async (audioUrl) => {
    try {
      setError(null);
      const currentWord = lesson.vocab[currentWordIndex];
      const analysis = await lessonService.analyzePronunciation(
        audioUrl,
        currentWord.word,
        lesson.language
      );
      
      setRecordings(prev => ({
        ...prev,
        [currentWordIndex]: audioUrl,
      }));

      // Update feedback state with the analysis
      // ... existing feedback update logic ...
    } catch (err) {
      setError(err.message || 'Failed to analyze pronunciation');
    }
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
            />

            <AudioPlayer audioUrl={recordings[currentWordIndex]} />
            <FeedbackDisplay feedback={feedback[currentWordIndex]} />

            <NavigationButtons
              onPrevious={handlePrevious}
              onNext={handleNext}
              isFirstWord={currentWordIndex === 0}
              isLastWord={currentWordIndex === lesson.vocab.length - 1}
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
