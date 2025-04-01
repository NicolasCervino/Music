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

// Improved hash function that produces consistent results across app sessions
const stableHash = (str: string): string => {
  // Normalize the URL for better consistency
  const normalizedStr = str.toLowerCase().trim();
  
  // Use a simple but consistent hashing algorithm
  let hash = 0;
  if (normalizedStr.length === 0) return hash.toString(36);
  
  for (let i = 0; i < normalizedStr.length; i++) {
    const char = normalizedStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Make it positive and convert to base 36 (alphanumeric) for shorter IDs
  return Math.abs(hash).toString(36);
};

// Generate a unique ID for each track - use just the URL as the primary key
const generateTrackId = (url: string): string => {
  // Remove common path prefixes and suffixes that might cause inconsistency
  const cleanUrl = url
    .replace('/storage/emulated/0/', '') // Remove common path prefix
    .split('?')[0]; // Remove any query parameters
    
  return `track-${stableHash(cleanUrl)}`;
};

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
      
      // Create a map to track processed songs and avoid duplicates
      const processedSongs = new Map<string, boolean>();
      
      const tracks = await Promise.all(songsToProcess.map(async (song): Promise<Track> => {
        let artworkColor = '';
        if (song.cover) {
          artworkColor = await ColorService.getStoredColor(song.url) || '';
        }

        // Generate a unique ID based only on URL
        const uniqueId = generateTrackId(song.url);
        
        return {
          id: uniqueId,
          url: song.url,
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

      // Filter out any duplicate tracks
      const uniqueTracks = tracks.filter(track => {
        if (processedSongs.has(track.url || '')) {
          return false;
        }
        processedSongs.set(track.url || '', true);
        return true;
      });

      return { tracks: uniqueTracks, hasMore };
    } catch (error) {
      console.error('Error getting tracks:', error);
      return { tracks: [], hasMore: false };
    }
  }
};