import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-24 h-24 border-8 border-b-green-600 border-t-green-400 border-l-green-600 border-r-green-400 rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
