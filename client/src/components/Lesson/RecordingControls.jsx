import React from 'react';

export const RecordingControls = ({ isRecording, onStartRecording, onStopRecording }) => (
  <div className="flex justify-center mb-6">
    <button
      onClick={isRecording ? onStopRecording : onStartRecording}
      className={`px-6 py-3 rounded-full text-white font-medium ${
        isRecording 
          ? 'bg-red-500 hover:bg-red-600' 
          : 'bg-indigo-600 hover:bg-indigo-700'
      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
    >
      {isRecording ? 'Stop Recording' : 'Start Recording'}
    </button>
  </div>
); 