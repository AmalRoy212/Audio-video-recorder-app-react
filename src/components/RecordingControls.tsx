import React from 'react';
import { Play, Pause, Square, Mic, Video, Download } from 'lucide-react';

interface RecordingControlsProps {
  isRecording: boolean;
  isPaused: boolean;
  hasRecording: boolean;
  mode: 'audio' | 'video';
  onStartRecording: () => void;
  onPauseRecording: () => void;
  onStopRecording: () => void;
  onDownload: () => void;
  onModeChange: (mode: 'audio' | 'video') => void;
}

export const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  isPaused,
  hasRecording,
  mode,
  onStartRecording,
  onPauseRecording,
  onStopRecording,
  onDownload,
  onModeChange,
}) => {
  return (
    <div className="flex flex-row justify-center gap-x-5 items-center ">
      {/* Mode Toggle */}
      <div className="flex bg-gray-800/50 backdrop-blur-sm rounded-xl p-1 border border-gray-700/50">
        <button
          onClick={() => onModeChange('audio')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
            mode === 'audio'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          <Mic size={18} />
          <span className="font-medium">Audio</span>
        </button>
        <button
          onClick={() => onModeChange('video')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
            mode === 'video'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          <Video size={18} />
          <span className="font-medium">Video</span>
        </button>
      </div>

      {/* Recording Controls */}
      <div className="flex items-center space-x-4">
        {!isRecording && !hasRecording && (
          <button
            onClick={onStartRecording}
            className="group relative w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-30 group-hover:opacity-50 animate-pulse"></div>
            <Play size={24} className="text-white ml-1" />
          </button>
        )}

        {isRecording && !isPaused && (
          <>
            <button
              onClick={onPauseRecording}
              className="w-14 h-14 bg-orange-500 hover:bg-orange-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
            >
              <Pause size={20} className="text-white" />
            </button>
            <button
              onClick={onStopRecording}
              className="w-14 h-14 bg-red-500 hover:bg-red-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
            >
              <Square size={20} className="text-white" />
            </button>
          </>
        )}

        {isRecording && isPaused && (
          <>
            <button
              onClick={onStartRecording}
              className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
            >
              <Play size={20} className="text-white" />
            </button>
            <button
              onClick={onStopRecording}
              className="w-14 h-14 bg-red-500 hover:bg-red-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
            >
              <Square size={20} className="text-white" />
            </button>
          </>
        )}

        {hasRecording && !isRecording && (
          <button
            onClick={onDownload}
            className="w-14 h-14 bg-teal-500 hover:bg-teal-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
          >
            <Download size={20} className="text-white" />
          </button>
        )}
      </div>
    </div>
  );
};