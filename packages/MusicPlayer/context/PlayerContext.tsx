import { createContext, useState, ReactNode } from 'react';
import { Track } from '../types';
import { useTheme } from '@/theme';
import { SAMPLE_TRACK } from '../sample';

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  artworkColor: string;
  setCurrentTrack: (track: Track | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setArtworkColor: (color: string) => void;
}

export const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(SAMPLE_TRACK);
  const [isPlaying, setIsPlaying] = useState(false);
  const [artworkColor, setArtworkColor] = useState<string>(theme.colors.accent);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        artworkColor,
        setCurrentTrack,
        setIsPlaying,
        setArtworkColor,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

