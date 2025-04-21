import React from 'react';
import Navbar from './Navbar';

const ProtectedLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    {children} 
      </main>
    </div>
  );
};

export default ProtectedLayout; 