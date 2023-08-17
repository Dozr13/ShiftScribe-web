import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className='fixed top-0 left-0 w-full h-full bg-slate-950 flex justify-center items-center z-50'>
      <div className='animate-spin-slow border-t-4 border-blue-500 h-12 w-12 rounded-full ease-linear'></div>
    </div>
  );
};

export default LoadingScreen;
