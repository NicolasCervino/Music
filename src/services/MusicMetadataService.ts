import { Track } from '@/entities';
import * as MediaLibrary from 'expo-media-library';
import { getAll, SortSongFields, SortSongOrder } from 'react-native-get-music-files';
import { ColorService } from './CacheColorService';

const PAGE_SIZE = 100;
const MAX_PAGES = 10; // Para encontrar más canciones

const EXCLUDED_PATHS = [
  '/storage/emulated/0/WhatsApp',
  '/storage/emulated/0/PowerDirector',
  'storage/emulated/0/bluetooth',
  '/storage/emulated/0/zedge'
];

export const MusicService = {
  formatDuration: (durationMs: number): string => {
    const totalSeconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  },

  getAllTracks: async (page: number = 0): Promise<{ tracks: Track[], hasMore: boolean }> => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission not granted');
      }
      
      const BATCH_SIZE = 100;
      let accumulatedSongs: any[] = [];
      let currentInternalPage = 0;
      let hasMoreInternal = true;
      
      while (accumulatedSongs.length < PAGE_SIZE && currentInternalPage < MAX_PAGES && hasMoreInternal) {
        const offset = (page * PAGE_SIZE) + (currentInternalPage * BATCH_SIZE);
        
        const batchSongsOrError = await getAll({
          coverQuality: 50,
          minSongDuration: 1000,
          sortBy: SortSongFields.TITLE,
          sortOrder: SortSongOrder.ASC,
          offset: offset,
          limit: BATCH_SIZE,
        });
        
        if (typeof batchSongsOrError === 'string') {
          console.error('Error getting music files:', batchSongsOrError);
          break;
        }
        
        if (batchSongsOrError.length === 0) {
          hasMoreInternal = false;
          break;
        }
        
        accumulatedSongs = [...accumulatedSongs, ...batchSongsOrError];
        currentInternalPage++;
        
        if (batchSongsOrError.length < BATCH_SIZE) {
          hasMoreInternal = false;
        }
      }
    
      const filteredSongs = accumulatedSongs.filter(song => {
        return !EXCLUDED_PATHS.some(path => 
          (song.url || '').toLowerCase().includes(path.toLowerCase())
        );
      });

      const hasMore = hasMoreInternal || (filteredSongs.length > PAGE_SIZE);
      const songsToProcess = filteredSongs.slice(0, PAGE_SIZE);
      
      const tracks = await Promise.all(songsToProcess.map(async (song): Promise<Track> => {
        let artworkColor = '';
        if (song.cover) {
          artworkColor = await ColorService.getStoredColor(song.url) || '';
        }

        return {
          id: song.url,
          title: song.title || 'Unknown Title',
          album: song.album || 'Unknown Album',
          artist: song.artist || 'Unknown Artist',
          duration: MusicService.formatDuration(song.duration),
          genre: song.genre || '',
          artwork: song.cover || undefined,
          audioUrl: song.url,
          artworkColor
        };
      }));

      return { tracks, hasMore };
    } catch (error) {
      console.error('Error getting tracks:', error);
      return { tracks: [], hasMore: false };
    }
  }
};