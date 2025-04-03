import { Track } from '@/entities';
import * as MediaLibrary from 'expo-media-library';
import { getAll, SortSongFields, SortSongOrder } from 'react-native-get-music-files';
import { ColorService } from './CacheColorService';
import { DatabaseService } from './DatabaseService';

const PAGE_SIZE = 100;
const MAX_PAGES = 50;
const BATCH_SIZE = 100;

// Folders to explicitly include
const MUSIC_DIRECTORIES = [
   '/storage/emulated/0/Music',
   '/storage/emulated/0/Download',
   '/sdcard/Music',
   '/storage/sdcard0/Music',
   '/storage/sdcard1/Music',
];

// Patterns and paths to exclude from music scanning
const EXCLUDED_PATTERNS = [
   // Paths
   '/storage/emulated/0/WhatsApp',
   '/storage/emulated/0/Android/media/com.whatsapp',
   '/storage/emulated/0/PowerDirector',
   '/storage/emulated/0/bluetooth',
   '/storage/emulated/0/zedge',
   '/storage/emulated/0/Telegram',
   '/storage/emulated/0/Android/data/com.whatsapp',

   // Keywords
   'whatsapp',
   'telegram',
   'voice message',
   'ptt',
   'status',
   'notification',
   'ringtone',
];

// WhatsApp audio pattern regex
const WHATSAPP_AUDIO_PATTERN = /aud-\d{8}-wa\d{4}/i;

// Utils
const stableHash = (str: string): string => {
   const normalizedStr = str.toLowerCase().trim();
   let hash = 0;

   if (normalizedStr.length === 0) return hash.toString(36);

   for (let i = 0; i < normalizedStr.length; i++) {
      const char = normalizedStr.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
   }

   return Math.abs(hash).toString(36);
};

const generateTrackId = (url: string): string => {
   const cleanUrl = url.replace('/storage/emulated/0/', '').split('?')[0];
   return `track-${stableHash(cleanUrl)}`;
};

// Check if track should be excluded based on URL
const shouldExcludeTrack = (url: string): boolean => {
   const lowerUrl = url.toLowerCase();

   return (
      EXCLUDED_PATTERNS.some(pattern => lowerUrl.includes(pattern)) ||
      WHATSAPP_AUDIO_PATTERN.test(lowerUrl)
   );
};

export const MusicService = {
   formatDuration: (durationMs: number): string => {
      const totalSeconds = Math.floor(durationMs / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
   },

   initialize: async (): Promise<void> => {
      try {
         await DatabaseService.initDatabase();
      } catch (error) {
         console.error('Error initializing music service:', error);
      }
   },

   getAllTracks: async (page: number = 0): Promise<{ tracks: Track[]; hasMore: boolean }> => {
      try {
         await MusicService.initialize();

         if (await DatabaseService.hasStoredTracks()) {
            const { tracks: dbTracks, total } = await DatabaseService.getPagedTracks(
               page,
               PAGE_SIZE
            );

            // Filter out unwanted tracks
            const tracks = dbTracks.filter(track => !shouldExcludeTrack(track.url || ''));

            // Check if we need to rescan due to many filtered tracks
            if (dbTracks.length - tracks.length > 10 && page === 0) {
               setTimeout(() => {
                  MusicService.rescanTracks().catch(e =>
                     console.error('Error during background rescan:', e)
                  );
               }, 5000);
            }

            const hasMore = (page + 1) * PAGE_SIZE < total - (dbTracks.length - tracks.length);
            return { tracks, hasMore };
         }

         return await MusicService.scanAndSaveTracks(page);
      } catch (error) {
         console.error('Error getting tracks:', error);
         return await MusicService.scanAndSaveTracks(page);
      }
   },

   scanAndSaveTracks: async (page: number = 0): Promise<{ tracks: Track[]; hasMore: boolean }> => {
      try {
         const { status } = await MediaLibrary.requestPermissionsAsync();
         if (status !== 'granted') throw new Error('Permission not granted');

         const scanMethods = [{ sortBy: SortSongFields.TITLE, sortOrder: SortSongOrder.ASC }];

         let allSongs: any[] = [];

         for (const method of scanMethods) {
            let currentPage = 0;
            let hasMore = true;

            while (currentPage < MAX_PAGES && hasMore) {
               const offset = currentPage * BATCH_SIZE;

               try {
                  const batchSongsOrError = await getAll({
                     coverQuality: 50,
                     minSongDuration: 30000,
                     sortBy: method.sortBy,
                     sortOrder: method.sortOrder,
                     offset: offset,
                     limit: BATCH_SIZE,
                  });

                  if (typeof batchSongsOrError === 'string') {
                     console.error('Error getting music files:', batchSongsOrError);
                     break;
                  }

                  if (batchSongsOrError.length === 0) {
                     hasMore = false;
                     break;
                  }

                  allSongs = [...allSongs, ...batchSongsOrError];

                  currentPage++;
                  hasMore = batchSongsOrError.length === BATCH_SIZE;
                  if (page === 0 && allSongs.length >= PAGE_SIZE * 2) {
                     break;
                  }
               } catch (error) {
                  console.error('Error scanning batch:', error);
                  hasMore = false;
               }
            }
         }
         // Filter out excluded tracks
         const filteredSongs = allSongs.filter(song => !shouldExcludeTrack(song.url || ''));

         // Process songs to tracks format
         const processedUrls = new Set<string>();
         const allTracks = await Promise.all(
            filteredSongs.map(async (song): Promise<Track> => {
               const artworkColor = song.cover
                  ? (await ColorService.getStoredColor(song.url)) || ''
                  : '';
               return {
                  id: generateTrackId(song.url),
                  url: song.url,
                  title: song.title || 'Unknown Title',
                  album: song.album || 'Unknown Album',
                  artist: song.artist || 'Unknown Artist',
                  duration: MusicService.formatDuration(song.duration),
                  genre: song.genre || '',
                  artwork: song.cover || undefined,
                  audioUrl: song.url,
                  artworkColor,
                  lastModified: song.lastModified || null,
                  fileSize: song.fileSize || null,
               };
            })
         );
         // Filter out duplicates
         const uniqueTracks = allTracks.filter(track => {
            if (processedUrls.has(track.url || '')) return false;
            processedUrls.add(track.url || '');
            return true;
         });
         // Save tracks to database in the background
         // This allows us to return the first page faster
         if (page === 0) {
            setTimeout(() => {
               DatabaseService.saveTracks(uniqueTracks).catch(error =>
                  console.error('Error saving tracks to database:', error)
               );
            }, 100);
         } else {
            await DatabaseService.saveTracks(uniqueTracks);
         }

         // Return requested page
         const startIdx = page * PAGE_SIZE;
         const endIdx = startIdx + PAGE_SIZE;
         const pageOfTracks = uniqueTracks.slice(startIdx, endIdx);

         return {
            tracks: pageOfTracks,
            hasMore: endIdx < uniqueTracks.length,
         };
      } catch (error) {
         console.error('Error scanning tracks:', error);
         return { tracks: [], hasMore: false };
      }
   },

   rescanTracks: async (): Promise<void> => {
      try {
         await DatabaseService.clearTracks();

         // Try to access specific directories
         for (const directory of MUSIC_DIRECTORIES) {
            try {
               await MediaLibrary.getAssetsAsync({
                  mediaType: MediaLibrary.MediaType.audio,
                  first: 10,
               });
            } catch (error) {
               console.error(`Error accessing ${directory}:`, error);
            }
         }

         await MusicService.scanAndSaveTracks(0);
      } catch (error) {
         console.error('Error rescanning tracks:', error);
      }
   },
};
