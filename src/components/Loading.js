import React from 'react';

const LoadingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-light-blue-500"></div>
      <div className="ml-4 text-white text-3xl">
        Loading...
      </div>
    </div>
  );
};

export default LoadingPage;
