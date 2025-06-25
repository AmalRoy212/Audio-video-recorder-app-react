interface Recording {
  id: string;
  blob: Blob;
  url: string;
  timestamp: number;
  duration: number;
  type: 'audio' | 'video';
}

const STORAGE_KEY = 'recorder-app-recordings';

export const saveRecording = (recording: Omit<Recording, 'id'>): Recording => {
  const newRecording: Recording = {
    ...recording,
    id: Date.now().toString(),
  };

  const existingRecordings = getRecordings();
  const updatedRecordings = [newRecording, ...existingRecordings];
  
  // Keep only the metadata in localStorage, not the blob
  const recordingsToStore = updatedRecordings.map(({ blob, url, ...rest }) => rest);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recordingsToStore));
  
  return newRecording;
};

export const getRecordings = (): Recording[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    // For demo purposes, we'll return empty array since we can't persist blobs
    // In a real app, you'd integrate with cloud storage
    return [];
  } catch (error) {
    console.error('Error loading recordings:', error);
    return [];
  }
};

export const deleteRecording = (id: string): void => {
  const existingRecordings = getRecordings();
  const updatedRecordings = existingRecordings.filter(r => r.id !== id);
  
  const recordingsToStore = updatedRecordings.map(({ blob, url, ...rest }) => rest);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recordingsToStore));
};

export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};