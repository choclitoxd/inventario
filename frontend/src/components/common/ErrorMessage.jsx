import React from 'react';
import { AlertTriangle } from 'lucide-react';

function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div className="bg-red-950/40 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3 animate-fadeIn">
      <AlertTriangle className="text-red-500 flex-shrink-0" />
      <span className="text-sm font-semibold">{message}</span>
    </div>
  );
}

export default ErrorMessage;
