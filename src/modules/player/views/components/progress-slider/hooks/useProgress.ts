import { useEffect, useState } from 'react';
import TrackPlayer, { useProgress as useTrackPlayerProgress } from 'react-native-track-player';

export function useProgress() {
  const progress = useTrackPlayerProgress();
  const [formattedPosition, setFormattedPosition] = useState('0:00');
  const [formattedDuration, setFormattedDuration] = useState('0:00');

  useEffect(() => {
    const formatTime = (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    setFormattedPosition(formatTime(progress.position));
    setFormattedDuration(formatTime(progress.duration));
  }, [progress.position, progress.duration]);

  const seekTo = async (position: number) => {
    await TrackPlayer.seekTo(position);
  };

  return {
    position: progress.position,
    duration: progress.duration,
    formattedPosition,
    formattedDuration,
    seekTo,
  };
}