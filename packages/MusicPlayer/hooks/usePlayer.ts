import { useCallback, useEffect } from 'react';
import { usePlayerContext } from './usePlayerContext';
import { useImageColor } from '@/packages/Images/hooks/useImageColor';
import { Track } from '../types';

export function usePlayer() {
  const {
    currentTrack,
    isPlaying,
    artworkColor,
    setCurrentTrack,
    setIsPlaying,
    setArtworkColor
  } = usePlayerContext();

  const { backgroundColor, onLoad } = useImageColor(currentTrack?.artwork);

  // Update artwork color whenever backgroundColor changes
  useEffect(() => {
    if (backgroundColor) {
      setArtworkColor(backgroundColor);
    }
  }, [backgroundColor, setArtworkColor]);

  // Handle artwork color changes
  const handleArtworkLoad = useCallback(async () => {
    await onLoad();
  }, [onLoad]);

  // Play a track
  const playTrack = useCallback((track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  }, [setCurrentTrack, setIsPlaying]);

  // Pause current track
  const pauseTrack = useCallback(() => {
    setIsPlaying(false);
  }, [setIsPlaying]);

  // Resume current track
  const resumeTrack = useCallback(() => {
    if (currentTrack) {
      setIsPlaying(true);
    }
  }, [currentTrack, setIsPlaying]);

  // Stop playback
  const stopTrack = useCallback(() => {
    setIsPlaying(false);
    setCurrentTrack(null);
  }, [setIsPlaying, setCurrentTrack]);

  return {
    // State
    currentTrack,
    isPlaying,
    artworkColor,

    // Methods
    playTrack,
    pauseTrack,
    resumeTrack,
    stopTrack,
    handleArtworkLoad,
  };
}