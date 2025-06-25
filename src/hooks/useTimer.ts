import { useState, useEffect, useRef } from 'react';

interface UseTimerReturn {
  seconds: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

export const useTimer = (): UseTimerReturn => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  const start = () => setIsActive(true);
  const pause = () => setIsActive(false);
  const reset = () => {
    setSeconds(0);
    setIsActive(false);
  };

  return { seconds, start, pause, reset };
};