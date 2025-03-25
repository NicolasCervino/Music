import { Track } from '@/entities';
import { MusicMetadataService } from '@/services/MusicMetadataService';
import { SongCacheService } from '@/services/SongCacheService';
import { TrackPlayerService } from '@/services/TrackPlayerService';
import TrackPlayer, { RepeatMode } from 'react-native-track-player';
import { create } from 'zustand';

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
      const cachedSongs = await SongCacheService.getCachedSongs();
      
      if (cachedSongs && cachedSongs.length > 0) {
        const filteredTracks = filterExcludedTracks(cachedSongs);
        await TrackPlayerService.setupPlayer();

        if (filteredTracks.length > 0) {
          await TrackPlayerService.addToQueue(filteredTracks);
        }

        set({
          songs: filteredTracks,
          currentPage: 0,
          hasMore: true 
        });
        
        // Load fresh data in the background
        MusicMetadataService.getAllTracks(0).then(({ tracks }) => {
          const freshFilteredTracks = filterExcludedTracks(tracks);
          if (JSON.stringify(freshFilteredTracks) !== JSON.stringify(filteredTracks)) {
            SongCacheService.cacheSongs(freshFilteredTracks);
            set({
              songs: freshFilteredTracks,
              currentPage: 0,
              hasMore: tracks.length >= 20 // Assuming PAGE_SIZE is 20
            });
          }
        });
      } else {
        // No cache or expired cache, load from source
        const { tracks, hasMore } = await MusicMetadataService.getAllTracks(0);
        const filteredTracks = filterExcludedTracks(tracks);
        await TrackPlayerService.setupPlayer();

        if (filteredTracks.length > 0) {
          await TrackPlayerService.addToQueue(filteredTracks);
          await SongCacheService.cacheSongs(filteredTracks);
        }

        set({
          songs: filteredTracks,
          currentPage: 0,
          hasMore
        });
      }
    } catch (error) {
      console.error('Error loading songs:', error);
      set({ songs: [], hasMore: false });
    }
  },
  loadMoreSongs: async () => {
    const { currentPage, isLoadingMore, hasMore, songs, currentTrack } = get();

    if (isLoadingMore || !hasMore) return;

    try {
      set({ isLoadingMore: true });
      const nextPage = currentPage + 1;
      const { tracks, hasMore: moreAvailable } = await MusicMetadataService.getAllTracks(nextPage);
      
      // Don't filter if there are no tracks
      if (!tracks || tracks.length === 0) {
        set({ 
          hasMore: false,
          isLoadingMore: false 
        });
        return;
      }

      const filteredTracks = filterExcludedTracks(tracks);

      // If all tracks were filtered out, try loading more
      if (filteredTracks.length === 0 && moreAvailable) {
        set({ 
          currentPage: nextPage,
          isLoadingMore: false 
        });
        // Recursively try to load more songs
        get().loadMoreSongs();
        return;
      }

      if (filteredTracks.length > 0) {
        // Only update the queue if we're not currently playing
        if (!currentTrack) {
          await TrackPlayerService.addToQueue(filteredTracks);
        } else {
          // If we're playing, append to queue without resetting
          const queue = filteredTracks.map(track => ({
            id: track.id,
            url: track.audioUrl,
            title: track.title,
            artist: track.artist,
            artwork: track.artwork,
            duration: parseInt(track.duration) || 0,
            album: track.album,
          }));
          await TrackPlayer.add(queue);
        }
        
        // Only append to cache if we have new songs
        await SongCacheService.appendToCache(filteredTracks);

        set({
          songs: [...songs, ...filteredTracks],
          currentPage: nextPage,
          hasMore: moreAvailable,
          isLoadingMore: false
        });
      } else {
        // No tracks after filtering
        set({ 
          hasMore: moreAvailable,
          isLoadingMore: false 
        });
      }
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