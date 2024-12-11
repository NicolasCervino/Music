import { create } from 'zustand';
import { Track } from '@/entities';
import { MusicMetadataService } from '@/services/MusicMetadataService';
import { TrackPlayerService } from '@/services/TrackPlayerService';
import TrackPlayer from 'react-native-track-player';

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
    try {
      const tracks = await MusicMetadataService.getSampleTracks();
      await TrackPlayerService.setupPlayer();

      const tracksWithDuration = [];
      // Process tracks sequentially instead of using Promise.all
      for (const track of tracks) {
        try {
          await TrackPlayer.reset();
          await TrackPlayer.add({
            id: track.id,
            url: track.audioUrl,
            title: track.title,
            artist: track.artist,
          });

          // Give more time for the track to load properly
          await new Promise(resolve => setTimeout(resolve, 500));

          const progress = await TrackPlayer.getProgress();

          const minutes = Math.floor(progress.duration / 60);
          const seconds = Math.floor(progress.duration % 60);
          const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

          tracksWithDuration.push({ ...track, duration: formattedDuration });
        } catch (error) {
          console.error(`Error getting duration for track ${track.title}:`, error);
          tracksWithDuration.push(track);
        }
      }

      await TrackPlayer.reset();
      set({ songs: tracksWithDuration });
    } catch (error) {
      console.error('Error loading songs:', error);
      set({ songs: [] });
    }
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