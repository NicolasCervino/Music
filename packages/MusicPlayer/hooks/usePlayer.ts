import { useCallback, useEffect, useState } from 'react';
import { usePlayerContext } from './usePlayerContext';
import { useImageColor } from '@/packages/Images/hooks/useImageColor';
import { Track } from '../types';

export function usePlayer() {
  const {
    currentTrack,
    isPlaying,
    artworkColor,
    isArtworkLoaded,
    isExpanded,
    setIsExpanded,
    setArtworkColor,
    setIsArtworkLoaded,
    playTrack,
    pauseTrack,
    resumeTrack,
    stopTrack,
  } = usePlayerContext();

  const { backgroundColor, onLoad, isLoading } = useImageColor(currentTrack?.artwork);

  // Handle artwork loading
  const handleArtworkLoad = useCallback(async () => {
    try {
      await onLoad();
      if (backgroundColor) {
        setArtworkColor(backgroundColor);
        setIsArtworkLoaded(true);
      }
    } catch (error) {
      console.error('Failed to load artwork:', error);
      setIsArtworkLoaded(false);
    }
  }, [onLoad, backgroundColor, setArtworkColor, setIsArtworkLoaded]);

  // Load artwork when track changes
  useEffect(() => {
    if (currentTrack) {
      setIsArtworkLoaded(false);
      handleArtworkLoad();
    }
  }, [currentTrack, handleArtworkLoad]);

  // Computed property to determine if player is ready
  const isPlayerReady = Boolean(
    currentTrack &&
    isArtworkLoaded &&
    artworkColor &&
    !isLoading
  );

  return {
    currentTrack,
    isPlaying,
    artworkColor,
    isArtworkLoaded,
    isPlayerReady,
    playTrack,
    pauseTrack,
    resumeTrack,
    stopTrack,
    handleArtworkLoad,
    isExpanded,
    setIsExpanded,
  };
}