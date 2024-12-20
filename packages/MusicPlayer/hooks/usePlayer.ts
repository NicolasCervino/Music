import { useImageColor } from '@/packages/Images/hooks/useImageColor';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useCallback, useEffect, useRef } from 'react';

export function usePlayer() {
  const {
    currentTrack,
    isPlaying,
    artworkColor,
    isArtworkLoaded,
    isExpanded,
    isVisible,
    setArtworkColor,
    setIsArtworkLoaded,
    playTrack,
    pauseTrack,
    resumeTrack,
    stopTrack,
    setIsExpanded,
    nextTrack,
    previousTrack,
    repeatMode,
    toggleRepeatMode
  } = usePlayerStore();

  const { backgroundColor, onLoad, isLoading } = useImageColor(currentTrack?.artwork, currentTrack?.id);
  const loadingRef = useRef(false);

  const handleArtworkLoad = useCallback(async () => {
    if (loadingRef.current) return;

    try {
      loadingRef.current = true;
      await onLoad();
      if (backgroundColor) {
        setArtworkColor(backgroundColor);
        setIsArtworkLoaded(true);
      }
    } catch (error) {
      console.error('Failed to load artwork:', error);
      setIsArtworkLoaded(false);
    } finally {
      loadingRef.current = false;
    }
  }, [onLoad, backgroundColor, setArtworkColor, setIsArtworkLoaded]);

  useEffect(() => {
    if (currentTrack && !isArtworkLoaded) {
      handleArtworkLoad();
    }
  }, [currentTrack, handleArtworkLoad, isArtworkLoaded]);

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
    isExpanded,
    isVisible,
    handleArtworkLoad,
    playTrack,
    pauseTrack,
    resumeTrack,
    stopTrack,
    setIsExpanded,
    nextTrack,
    previousTrack,
    repeatMode,
    toggleRepeatMode
  };
}