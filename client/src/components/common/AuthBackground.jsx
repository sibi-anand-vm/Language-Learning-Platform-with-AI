import React from 'react';
import aiTutorBg from '../../assets/ai-tutor-bg.png';

const AuthBackground = ({ children }) => {
  return (
    <div className="min-h-screen relative bg-[#f5f7ff] flex flex-col">
      {/* Background container with aspect ratio */}
      <div className="absolute inset-0 w-full h-full">
        <div 
          className="w-full h-full bg-responsive"
          style={{
            backgroundImage: `url(${aiTutorBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'left center',
            '@media (min-width: 768px)': {
              backgroundSize: '1024px auto',
              backgroundPosition: 'center center'
            },
            '@media (min-width: 1280px)': {
              backgroundSize: '80% auto'
            }
          }}
        />
      </div>
      
      {/* Gradient overlay - optimized for image dimensions */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f5f7ff]/70 via-[#f5f7ff]/80 to-[#f5f7ff]/90" />

      {/* Content container */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-6 md:px-6 md:py-8">
        <div className="w-full max-w-[340px] md:max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthBackground; 