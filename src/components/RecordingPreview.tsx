import React, { useRef } from 'react';
import { Play, Pause, Download, Trash2 } from 'lucide-react';

interface Recording {
  id: string;
  blob: Blob;
  url: string;
  timestamp: number;
  duration: number;
  type: 'audio' | 'video';
}

interface RecordingPreviewProps {
  recording: Recording | null;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onDownload: () => void;
  onDelete: () => void;
}

export const RecordingPreview: React.FC<RecordingPreviewProps> = ({
  recording,
  isPlaying,
  onPlay,
  onPause,
  onDownload,
  onDelete,
}) => {
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);

  if (!recording) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            {recording.type === 'video' ? 'Video Recording' : 'Audio Recording'}
          </h3>
          <span className="text-sm text-gray-400">
            {formatDuration(recording.duration)}
          </span>
        </div>

        <div className="mb-4">
          {recording.type === 'video' ? (
            <video
              ref={mediaRef as React.RefObject<HTMLVideoElement>}
              src={recording.url}
              className="w-full rounded-lg"
              controls={false}
            />
          ) : (
            <div className="aspect-video bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-3 mx-auto">
                  <Play size={24} className="text-white ml-1" />
                </div>
                <p className="text-gray-300 font-medium">Audio Recording</p>
              </div>
            </div>
          )}
          {recording.type === 'audio' && (
            <audio
              ref={mediaRef as React.RefObject<HTMLAudioElement>}
              src={recording.url}
              className="hidden"
            />
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            onClick={isPlaying ? onPause : onPlay}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
          >
            {isPlaying ? (
              <Pause size={18} className="text-white" />
            ) : (
              <Play size={18} className="text-white ml-1" />
            )}
            <span className="text-white font-medium">
              {isPlaying ? 'Pause' : 'Play'}
            </span>
          </button>

          <div className="flex space-x-2">
            <button
              onClick={onDownload}
              className="p-2 bg-teal-600 hover:bg-teal-700 rounded-lg transition-all duration-300 hover:scale-105"
              title="Download"
            >
              <Download size={18} className="text-white" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-300 hover:scale-105"
              title="Delete"
            >
              <Trash2 size={18} className="text-white" />
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-400">
          Recorded: {formatTimestamp(recording.timestamp)}
        </p>
      </div>
    </div>
  );
};