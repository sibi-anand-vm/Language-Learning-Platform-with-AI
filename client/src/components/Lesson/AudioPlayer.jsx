import React, { useRef } from 'react';

export const AudioPlayer = ({ audioUrl }) => {
  const audioRef = useRef();

  if (!audioUrl) return null;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Your Recording</h3>
      <audio 
        ref={audioRef}
        src={audioUrl} 
        controls 
        className="w-full"
      />
    </div>
  );
}; 