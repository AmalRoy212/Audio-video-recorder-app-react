import React, { useRef, useEffect } from 'react';
import { Camera, CameraOff, Mic } from 'lucide-react';

interface VideoPreviewProps {
  stream: MediaStream | null;
  isRecording: boolean;
  mode: 'audio' | 'video';
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({ stream, isRecording, mode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream && mode === 'video') {
      videoRef.current.srcObject = stream;
    }
  }, [stream, mode]);

  if (mode === 'audio') {
    return (
      <div className="w-full max-w-md mx-auto aspect-square bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl border border-gray-700/50 backdrop-blur-sm flex flex-col items-center justify-center h-[400px]">
        <div className={`w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center transition-all duration-300 ${
          isRecording ? 'animate-pulse scale-110' : ''
        }`}>
          <Mic size={32} className="text-white" />
        </div>
        <p className="text-gray-300 mt-4 text-lg font-medium">
          {isRecording ? 'Recording Audio...' : 'Audio Mode'}
        </p>
        {isRecording && (
          <div className="flex space-x-1 mt-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 bg-gradient-to-t from-purple-600 to-pink-600 rounded-full animate-pulse"
                style={{
                  height: `${20 + Math.random() * 3}px`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto h-[400px]">
      <div className="relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-700/50 backdrop-blur-sm">
        {stream ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full aspect-video object-cover"
            />
            {isRecording && (
              <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-500 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-white text-sm font-medium">REC</span>
              </div>
            )}
            <div className="absolute top-4 right-4">
              <Camera size={20} className="text-white" />
            </div>
          </>
        ) : (
          <div className="aspect-video flex flex-col items-center justify-center">
            <CameraOff size={48} className="text-gray-400 mb-4" />
            <p className="text-gray-400 text-center">
              Camera access required for video recording
            </p>
          </div>
        )}
      </div>
    </div>
  );
};