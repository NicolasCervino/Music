import { createContext, useState, ReactNode, useCallback } from 'react';
import { Track } from '../types';
import { useTheme } from '@/theme';
import { SAMPLE_TRACK } from '../sample';

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  artworkColor: string;
  isArtworkLoaded: boolean;
  setCurrentTrack: (track: Track | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setArtworkColor: (color: string) => void;
  setIsArtworkLoaded: (loaded: boolean) => void;
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  stopTrack: () => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

export const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(SAMPLE_TRACK);
  const [isPlaying, setIsPlaying] = useState(false);
  const [artworkColor, setArtworkColor] = useState<string>(theme.colors.accent);
  const [isArtworkLoaded, setIsArtworkLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const playTrack = useCallback((track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  }, []);

  const pauseTrack = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const resumeTrack = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const stopTrack = useCallback(() => {
    setIsPlaying(false);
    setCurrentTrack(null);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        artworkColor,
        isArtworkLoaded,
        setCurrentTrack,
        setIsPlaying,
        setArtworkColor,
        setIsArtworkLoaded,
        playTrack,
        pauseTrack,
        resumeTrack,
        stopTrack,
        isExpanded,
        setIsExpanded,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

