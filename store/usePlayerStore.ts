import { create } from 'zustand';
import { Track } from '@/entities';
import { SAMPLE_SONGS } from '@/packages/Songs/sample';

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  artworkColor: string;
  isArtworkLoaded: boolean;
  isExpanded: boolean;
  songs: Track[];
  isVisible: boolean;
}

interface PlayerActions {
  setCurrentTrack: (track: Track | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setArtworkColor: (color: string) => void;
  setIsArtworkLoaded: (loaded: boolean) => void;
  setIsExpanded: (expanded: boolean) => void;
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  stopTrack: () => void;
  setIsVisible: (visible: boolean) => void;
}

export const usePlayerStore = create<PlayerState & PlayerActions>((set) => ({
  // Initial state
  currentTrack: null,
  isPlaying: false,
  artworkColor: '',
  isArtworkLoaded: false,
  isExpanded: false,
  isVisible: false,
  songs: SAMPLE_SONGS,

  // Actions
  setIsVisible: (visible) => set({ isVisible: visible }),
  setCurrentTrack: (track) => set({ currentTrack: track }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setArtworkColor: (color) => set({ artworkColor: color }),
  setIsArtworkLoaded: (loaded) => set({ isArtworkLoaded: loaded }),
  setIsExpanded: (expanded) => set({ isExpanded: expanded }),

  playTrack: (track) => set({
    currentTrack: track,
    isPlaying: true,
    isArtworkLoaded: false,
    isVisible: true,
  }),
  pauseTrack: () => set({ isPlaying: false }),
  resumeTrack: () => set({ isPlaying: true }),
  stopTrack: () => set({
    isPlaying: false,
    currentTrack: null,
    isVisible: false
  }),
}));