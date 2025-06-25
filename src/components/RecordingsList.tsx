import React from 'react';
import { Download, Play, Trash2, Music, Video } from 'lucide-react';

interface Recording {
  id: string;
  blob: Blob;
  url: string;
  timestamp: number;
  duration: number;
  type: 'audio' | 'video';
}

interface RecordingsListProps {
  recordings: Recording[];
  onPlay: (recording: Recording) => void;
  onDownload: (recording: Recording) => void;
  onDelete: (id: string) => void;
}

export const RecordingsList: React.FC<RecordingsListProps> = ({
  recordings,
  onPlay,
  onDownload,
  onDelete,
}) => {
  if (recordings.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Music size={24} className="text-gray-400" />
        </div>
        <p className="text-gray-400">No recordings yet</p>
      </div>
    );
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white mb-4">Past Recordings</h3>
      {recordings.map((recording) => (
        <div
          key={recording.id}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 hover:bg-gray-800/70 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                {recording.type === 'video' ? (
                  <Video size={18} className="text-white" />
                ) : (
                  <Music size={18} className="text-white" />
                )}
              </div>
              <div>
                <p className="text-white font-medium">
                  {recording.type === 'video' ? 'Video' : 'Audio'} Recording
                </p>
                <p className="text-sm text-gray-400">
                  {formatTimestamp(recording.timestamp)} • {formatDuration(recording.duration)}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onPlay(recording)}
                className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all duration-300 hover:scale-105"
                title="Play"
              >
                <Play size={16} className="text-white ml-0.5" />
              </button>
              <button
                onClick={() => onDownload(recording)}
                className="p-2 bg-teal-600 hover:bg-teal-700 rounded-lg transition-all duration-300 hover:scale-105"
                title="Download"
              >
                <Download size={16} className="text-white" />
              </button>
              <button
                onClick={() => onDelete(recording.id)}
                className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-300 hover:scale-105"
                title="Delete"
              >
                <Trash2 size={16} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};