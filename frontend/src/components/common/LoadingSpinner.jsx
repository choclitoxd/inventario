import React from 'react';

function LoadingSpinner({ message = 'CARGANDO...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <div className="w-8 h-8 border-4 border-neonGreen border-t-transparent rounded-full animate-spin shadow-neon-green" />
      <p className="text-xs text-carbon-500 font-semibold tracking-wider uppercase">{message}</p>
    </div>
  );
}

export default LoadingSpinner;
