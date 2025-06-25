import React from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  seconds: number;
  isRecording: boolean;
}

export const Timer: React.FC<TimerProps> = ({ seconds, isRecording }) => {
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 transition-all duration-300 ${
      isRecording ? 'animate-pulse' : ''
    }`}>
      <Clock size={18} className={`${
        isRecording ? 'text-red-400' : 'text-gray-400'
      } transition-colors duration-300`} />
      <span className={`font-mono text-lg font-semibold ${
        isRecording ? 'text-red-400' : 'text-white'
      } transition-colors duration-300`}>
        {formatTime(seconds)}
      </span>
    </div>
  );
};