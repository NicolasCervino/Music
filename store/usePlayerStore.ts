import { create } from 'zustand';
import { Track } from '@/entities';
import { MusicMetadataService } from '@/services/MusicMetadataService';
import { TrackPlayerService } from '@/services/TrackPlayerService';
import TrackPlayer, { RepeatMode } from 'react-native-track-player';

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  artworkColor: string;
  isArtworkLoaded: boolean;
  isExpanded: boolean;
  songs: Track[];
  isVisible: boolean;
  repeatMode: RepeatMode;
  currentPage: number;
  isLoadingMore: boolean;
  hasMore: boolean;
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
  nextTrack: () => void;
  previousTrack: () => void;
  setIsVisible: (visible: boolean) => void;
  loadSongs: () => Promise<void>;
  toggleRepeatMode: () => void;
  loadMoreSongs: () => Promise<void>;
}

const EXCLUDED_PATHS = [
  '/storage/emulated/0/WhatsApp',
  '/storage/emulated/0/PowerDirector',
  'storage/emulated/0/bluetooth',
  '/storage/emulated/0/zedge'
];

const filterExcludedTracks = (tracks: Track[]): Track[] => {
  return tracks.filter(track =>
    !EXCLUDED_PATHS.some(path =>
      track.audioUrl.toLowerCase().includes(path.toLowerCase())
    )
  );
};

export const usePlayerStore = create<PlayerState & PlayerActions>((set, get) => ({
  // Initial state
  currentTrack: null,
  isPlaying: false,
  artworkColor: '',
  isArtworkLoaded: false,
  isExpanded: false,
  isVisible: false,
  songs: [],
  repeatMode: RepeatMode.Off,
  currentPage: 0,
  isLoadingMore: false,
  hasMore: true,

  // Actions
  loadSongs: async () => {
    try {
      const { tracks, hasMore } = await MusicMetadataService.getAllTracks(0);
      const filteredTracks = filterExcludedTracks(tracks);
      await TrackPlayerService.setupPlayer();

      if (filteredTracks.length > 0) {
        await TrackPlayerService.addToQueue(filteredTracks);
      }

      set({
        songs: filteredTracks,
        currentPage: 0,
        hasMore
      });
    } catch (error) {
      console.error('Error loading songs:', error);
      set({ songs: [], hasMore: false });
    }
  },
  loadMoreSongs: async () => {
    const { currentPage, isLoadingMore, hasMore, songs } = get();

    if (isLoadingMore || !hasMore) return;

    try {
      set({ isLoadingMore: true });
      const nextPage = currentPage + 1;
      const { tracks, hasMore: moreAvailable } = await MusicMetadataService.getAllTracks(nextPage);
      const filteredTracks = filterExcludedTracks(tracks);

      if (filteredTracks.length > 0) {
        await TrackPlayerService.addToQueue(filteredTracks);
      }

      set({
        songs: [...songs, ...filteredTracks],
        currentPage: nextPage,
        hasMore: moreAvailable,
        isLoadingMore: false
      });
    } catch (error) {
      console.error('Error loading more songs:', error);
      set({ isLoadingMore: false });
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
      const { songs } = get();
      const trackIndex = songs.findIndex(t => t.id === track.id);

      await TrackPlayerService.stop();
      await TrackPlayerService.addToQueue(songs, trackIndex);
      await TrackPlayerService.play();

      // Only set isVisible here since other states will be updated by PlaybackService events
      set({ isVisible: true });
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
  nextTrack: async () => {
    try {
      await TrackPlayerService.skipToNext();
      // State will be updated by the PlaybackTrackChanged event listener
    } catch (error) {
      console.error('Error playing next track:', error);
    }
  },

  previousTrack: async () => {
    try {
      await TrackPlayerService.skipToPrevious();
      // State will be updated by the PlaybackTrackChanged event listener
    } catch (error) {
      console.error('Error playing previous track:', error);
    }
  },
  toggleRepeatMode: async () => {
    try {
      const { repeatMode } = get();
      const newMode = repeatMode === RepeatMode.Off
        ? RepeatMode.Queue
        : RepeatMode.Off;

      await TrackPlayer.setRepeatMode(newMode);
      set({ repeatMode: newMode });
    } catch (error) {
      console.error('Error toggling repeat mode:', error);
    }
  },
}));