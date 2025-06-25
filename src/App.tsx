import React, { useState, useEffect, useRef } from 'react';
import { RecordingControls } from './components/RecordingControls';
import { Timer } from './components/Timer';
import { VideoPreview } from './components/VideoPreview';
import { RecordingPreview } from './components/RecordingPreview';
import { RecordingsList } from './components/RecordingsList';
import { useMediaRecorder } from './hooks/useMediaRecorder';
import { useTimer } from './hooks/useTimer';
import { downloadBlob, saveRecording } from './utils/storage';
import { AlertTriangle, Mic, Video } from 'lucide-react';

interface Recording {
  id: string;
  blob: Blob;
  url: string;
  timestamp: number;
  duration: number;
  type: 'audio' | 'video';
}

function App() {
  const [mode, setMode] = useState<'audio' | 'video'>('audio');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [currentRecording, setCurrentRecording] = useState<Recording | null>(null);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  
  const mediaPlayerRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  
  const {
    isRecording,
    isPaused,
    hasRecording,
    recordedBlob,
    error: recordingError,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    clearRecording,
  } = useMediaRecorder();

  const { seconds, start: startTimer, pause: pauseTimer, reset: resetTimer } = useTimer();

  const getMediaStream = async (mediaMode: 'audio' | 'video') => {
    try {
      setPermissionError(null);
      const constraints = mediaMode === 'video' 
        ? { video: true, audio: true }
        : { audio: true };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      return mediaStream;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Permission denied';
      setPermissionError(`Camera/microphone access denied: ${errorMessage}`);
      throw err;
    }
  };

  const handleStartRecording = async () => {
    try {
      if (hasRecording) {
        clearRecording();
        setCurrentRecording(null);
      }

      let mediaStream = stream;
      if (!mediaStream) {
        mediaStream = await getMediaStream(mode);
      }

      if (mediaStream) {
        if (isPaused) {
          resumeRecording();
          startTimer();
        } else {
          startRecording(mediaStream);
          resetTimer();
          startTimer();
        }
      }
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const handlePauseRecording = () => {
    pauseRecording();
    pauseTimer();
  };

  const handleStopRecording = () => {
    stopRecording();
    pauseTimer();
  };

  const handleModeChange = (newMode: 'audio' | 'video') => {
    if (isRecording) return;
    
    setMode(newMode);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    clearRecording();
    setCurrentRecording(null);
    resetTimer();
  };

  const createRecordingFromBlob = (blob: Blob): Recording => {
    const url = URL.createObjectURL(blob);
    return {
      id: Date.now().toString(),
      blob,
      url,
      timestamp: Date.now(),
      duration: seconds,
      type: mode,
    };
  };

  const handleDownloadCurrent = () => {
    if (recordedBlob) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const extension = mode === 'video' ? 'webm' : 'webm';
      const filename = `${mode}-recording-${timestamp}.${extension}`;
      downloadBlob(recordedBlob, filename);
    }
  };

  const handleSaveRecording = () => {
    if (recordedBlob) {
      const recording = createRecordingFromBlob(recordedBlob);
      setCurrentRecording(recording);
      setRecordings(prev => [recording, ...prev]);
    }
  };

  const handlePlayRecording = (recording: Recording) => {
    setCurrentRecording(recording);
    setIsPlaying(true);
    
    if (mediaPlayerRef.current) {
      mediaPlayerRef.current.src = recording.url;
      mediaPlayerRef.current.play();
    }
  };

  const handlePlayPause = () => {
    if (!mediaPlayerRef.current || !currentRecording) return;

    if (isPlaying) {
      mediaPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      mediaPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleDownloadRecording = (recording: Recording) => {
    const timestamp = new Date(recording.timestamp).toISOString().replace(/[:.]/g, '-');
    const extension = recording.type === 'video' ? 'webm' : 'webm';
    const filename = `${recording.type}-recording-${timestamp}.${extension}`;
    downloadBlob(recording.blob, filename);
  };

  const handleDeleteRecording = (id: string) => {
    setRecordings(prev => {
      const updated = prev.filter(r => r.id !== id);
      const deletedRecording = prev.find(r => r.id === id);
      if (deletedRecording && currentRecording?.id === id) {
        setCurrentRecording(null);
        setIsPlaying(false);
      }
      return updated;
    });
  };

  const handleDeleteCurrent = () => {
    if (currentRecording) {
      handleDeleteRecording(currentRecording.id);
    }
    clearRecording();
    setCurrentRecording(null);
  };

  useEffect(() => {
    if (recordedBlob && !currentRecording) {
      handleSaveRecording();
    }
  }, [recordedBlob]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      recordings.forEach(recording => {
        URL.revokeObjectURL(recording.url);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        {/* <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              {mode === 'video' ? (
                <Video size={24} className="text-white" />
              ) : (
                <Mic size={24} className="text-white" />
              )}
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Media Recorder
            </h1>
          </div>
          <p className="text-gray-700 text-lg">
            Record high-quality audio and video with ease
          </p>
        </div> */}

        {/* Error Messages */}
        {(permissionError || recordingError) && (
          <div className="max-w-md mx-auto mb-6 p-4 bg-red-900/50 border border-red-700/50 rounded-xl flex items-center space-x-3">
            <AlertTriangle size={20} className="text-red-400" />
            <p className="text-red-200 text-sm">
              {permissionError || recordingError}
            </p>
          </div>
        )}

        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            {/* Recording Section */}
            <div className="space-y-6 w-2/3">
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                <VideoPreview 
                  stream={stream} 
                  isRecording={isRecording && !isPaused} 
                  mode={mode} 
                />
                
                <div className="mt-6 w-full space-x-5 flex juastify-center items-center">
                  <div className="">
                    <Timer seconds={seconds} isRecording={isRecording && !isPaused} />
                  </div>
                  
                  <RecordingControls
                    isRecording={isRecording}
                    isPaused={isPaused}
                    hasRecording={hasRecording}
                    mode={mode}
                    onStartRecording={handleStartRecording}
                    onPauseRecording={handlePauseRecording}
                    onStopRecording={handleStopRecording}
                    onDownload={handleDownloadCurrent}
                    onModeChange={handleModeChange}
                  />
                </div>
              </div>
            </div>

            {/* Preview & History Section */}
            <div className="space-y-6 w-1/3">
              {currentRecording && (
                <RecordingPreview
                  recording={currentRecording}
                  isPlaying={isPlaying}
                  onPlay={handlePlayPause}
                  onPause={handlePlayPause}
                  onDownload={() => handleDownloadRecording(currentRecording)}
                  onDelete={handleDeleteCurrent}
                />
              )}

              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                <RecordingsList
                  recordings={recordings}
                  onPlay={handlePlayRecording}
                  onDownload={handleDownloadRecording}
                  onDelete={handleDeleteRecording}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hidden media element for playback */}
        {currentRecording && (
          currentRecording.type === 'video' ? (
            <video
              ref={mediaPlayerRef as React.RefObject<HTMLVideoElement>}
              className="hidden"
              onEnded={() => setIsPlaying(false)}
            />
          ) : (
            <audio
              ref={mediaPlayerRef as React.RefObject<HTMLAudioElement>}
              className="hidden"
              onEnded={() => setIsPlaying(false)}
            />
          )
        )}
      </div>
    </div>
  );
}

export default App;