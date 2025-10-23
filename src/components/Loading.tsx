import React from 'react';

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-primary mb-4"></div>
      {message && <p className="text-lg font-semibold text-primary animate-pulse">{message}</p>}
    </div>
  );
};

export default Loading;
