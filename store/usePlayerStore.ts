import { create } from 'zustand';
import { Track } from '@/entities';
import { MusicMetadataService } from '@/services/MusicMetadataService';
import { TrackPlayerService } from '@/services/TrackPlayerService';

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
  loadSongs: () => Promise<void>;
}

export const usePlayerStore = create<PlayerState & PlayerActions>((set) => ({
  // Initial state
  currentTrack: null,
  isPlaying: false,
  artworkColor: '',
  isArtworkLoaded: false,
  isExpanded: false,
  isVisible: false,
  songs: [],

  // Actions
  loadSongs: async () => {
    const tracks = await MusicMetadataService.getSampleTracks();
    set({ songs: tracks });
  },
  setIsVisible: (visible) => set({ isVisible: visible }),
  setCurrentTrack: (track) => set({ currentTrack: track }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setArtworkColor: (color) => set({ artworkColor: color }),
  setIsArtworkLoaded: (loaded) => set({ isArtworkLoaded: loaded }),
  setIsExpanded: (expanded) => set({ isExpanded: expanded }),

  playTrack: async (track) => {
    try {
      await TrackPlayerService.stop(); // Reset previous track
      await TrackPlayerService.addTrack(track);
      await TrackPlayerService.play();
      set({
        currentTrack: track,
        isPlaying: true,
        isArtworkLoaded: false,
        isVisible: true,
      });
    } catch (error) {
      console.error('Error playing track:', error);
    }
  },

  pauseTrack: async () => {
    try {
      await TrackPlayerService.pause();
      set({ isPlaying: false });
    } catch (error) {
      console.error('Error pausing track:', error);
    }
  },

  resumeTrack: async () => {
    try {
      await TrackPlayerService.play();
      set({ isPlaying: true });
    } catch (error) {
      console.error('Error resuming track:', error);
    }
  },

  stopTrack: async () => {
    try {
      await TrackPlayerService.stop();
      set({
        isPlaying: false,
        currentTrack: null,
        isVisible: false,
      });
    } catch (error) {
      console.error('Error stopping track:', error);
    }
  },
}));