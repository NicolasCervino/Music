import { Album, Artist, Track } from '@/entities';
import * as MediaLibrary from 'expo-media-library';
import { getAlbums, getAll, SortSongFields, SortSongOrder } from 'react-native-get-music-files';
import { ColorService } from '../CacheColorService';
import { DatabaseService } from '../database';
import {
   BATCH_SIZE,
   EXCLUDED_PATTERNS,
   MAX_PAGES,
   MUSIC_DIRECTORIES,
   PAGE_SIZE,
} from './constants';
import { musicMetadataUtils } from './utils';

export const MusicService = {
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
            const tracks = dbTracks.filter(
               track => !musicMetadataUtils.shouldExcludeTrack(track.url || '')
            );

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
         const filteredSongs = allSongs.filter(
            song => !musicMetadataUtils.shouldExcludeTrack(song.url || '')
         );

         // Process songs to tracks format
         const processedUrls = new Set<string>();
         const allTracks = await Promise.all(
            filteredSongs.map(async (song): Promise<Track> => {
               const artworkColor = song.cover
                  ? (await ColorService.getStoredColor(song.url)) || ''
                  : '';
               const artistName = song.artist || 'Unknown Artist';
               const albumTitle = song.album || 'Unknown Album';

               // Create Artist object
               const artistId = `artist-${musicMetadataUtils.stableHash(artistName)}`;
               const artist = {
                  id: artistId,
                  name: artistName,
                  image: song.cover || '',
                  genres: song.genre ? [song.genre] : [],
               };

               // Create Album object
               const albumId = `album-${musicMetadataUtils.stableHash(
                  albumTitle + '-' + artistName
               )}`;
               const album = {
                  id: albumId,
                  title: albumTitle,
                  artist: artistName,
                  artwork: song.cover || '',
               };

               return {
                  id: musicMetadataUtils.generateTrackId(song.url),
                  url: song.url,
                  title: song.title || 'Unknown Title',
                  artist,
                  album,
                  duration: musicMetadataUtils.formatDuration(song.duration),
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

   getArtists: async (): Promise<Artist[]> => {
      try {
         // Get all tracks from database
         const tracks = await DatabaseService.getAllTracks();

         // Create a map to store artist data
         const artistsMap = new Map<string, Artist>();

         // Process each track
         tracks.forEach(track => {
            const artist = track.artist;

            if (!artistsMap.has(artist.id)) {
               // First time seeing this artist
               artistsMap.set(artist.id, {
                  id: artist.id,
                  name: artist.name,
                  image: artist.image || track.artwork || '',
                  genres: artist.genres || [],
               });
            } else {
               // Update artist's genres if track has genre info
               const existingArtist = artistsMap.get(artist.id)!;

               // Merge genres from this track if they're not already included
               if (track.genre && !existingArtist.genres.includes(track.genre)) {
                  existingArtist.genres = [...existingArtist.genres, track.genre];
               }
            }
         });

         // Convert map to array
         return Array.from(artistsMap.values());
      } catch (error) {
         console.error('Error getting artists:', error);
         return [];
      }
   },

   getPopularArtists: async (limit: number = 3): Promise<Artist[]> => {
      try {
         // Get all tracks
         const tracks = await DatabaseService.getAllTracks();

         // Count tracks per artist
         const artistTrackCounts = new Map<string, number>();
         const artistData = new Map<string, Artist>();

         tracks.forEach(track => {
            const artistId = track.artist.id;

            // Count tracks
            artistTrackCounts.set(artistId, (artistTrackCounts.get(artistId) || 0) + 1);

            // Store artist data if not already stored
            if (!artistData.has(artistId)) {
               artistData.set(artistId, {
                  id: artistId,
                  name: track.artist.name,
                  image: track.artist.image || track.artwork || '',
                  genres: track.artist.genres || [],
               });
            }
         });

         // Sort artists by track count and get top ones
         const topArtistIds = [...artistTrackCounts.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(entry => entry[0]);

         // Get artist data for top artists
         return topArtistIds.map(id => artistData.get(id)!);
      } catch (error) {
         console.error('Error getting popular artists:', error);
         return [];
      }
   },

   getArtistById: async (artistId: string) => {
      try {
         const artists = await MusicService.getArtists();
         return artists.find(artist => artist.id === artistId) || null;
      } catch (error) {
         console.error('Error getting artist by ID:', error);
         return null;
      }
   },

   getTracksByArtistId: async (artistId: string) => {
      try {
         const allTracks = await DatabaseService.getAllTracks();
         const artist = await MusicService.getArtistById(artistId);

         if (!artist) return [];

         // Filter tracks by artist ID
         return allTracks.filter(track => track.artist.id === artistId);
      } catch (error) {
         console.error('Error getting tracks by artist ID:', error);
         return [];
      }
   },

   getAlbums: async (): Promise<Album[]> => {
      try {
         // Get all tracks from database
         const tracks = await DatabaseService.getAllTracks();

         if (tracks.length > 0) {
            const albumsMap = new Map<string, Album>();

            tracks.forEach(track => {
               // Skip tracks that are invalid or should be excluded
               if (
                  !track.url ||
                  !track.album ||
                  !track.artist ||
                  musicMetadataUtils.shouldExcludeTrack(track.url)
               ) {
                  return;
               }

               const album = track.album;
               const albumArtist = track.artist.name || 'Unknown Artist';

               // Ignore albums with excluded patterns
               if (
                  EXCLUDED_PATTERNS.some(
                     pattern =>
                        (album.title || 'Unknown Album').toLowerCase().includes(pattern) ||
                        albumArtist.toLowerCase().includes(pattern)
                  )
               ) {
                  return;
               }

               if (!albumsMap.has(album.id)) {
                  albumsMap.set(album.id, {
                     id: album.id,
                     title: album.title || 'Unknown Album',
                     artist: albumArtist,
                     artwork: album.artwork || track.artwork || '',
                  });
               } else if (!albumsMap.get(album.id)?.artwork && (album.artwork || track.artwork)) {
                  const existingAlbum = albumsMap.get(album.id)!;
                  albumsMap.set(album.id, {
                     ...existingAlbum,
                     artwork: album.artwork || track.artwork || '',
                  });
               }
            });

            return Array.from(albumsMap.values());
         }

         // Fallback strategy using native API
         // Only use if no tracks in database
         const albumsResult = await getAlbums({
            coverQuality: 50,
            artist: '',
         });

         if (typeof albumsResult === 'string' || albumsResult.length === 0) {
            return [];
         }

         const uniqueAlbums = new Map<string, Album>();

         albumsResult.forEach(libraryAlbum => {
            const albumName = libraryAlbum.album || 'Unknown Album';
            const artistName = libraryAlbum.artist || 'Unknown Artist';

            // Apply exclusions
            if (
               EXCLUDED_PATTERNS.some(
                  pattern =>
                     albumName.toLowerCase().includes(pattern) ||
                     artistName.toLowerCase().includes(pattern) ||
                     (libraryAlbum.url && musicMetadataUtils.shouldExcludeTrack(libraryAlbum.url))
               )
            ) {
               return;
            }

            const id = `album-${musicMetadataUtils.stableHash(albumName + '-' + artistName)}`;

            const album = {
               id,
               title: albumName,
               artist: artistName,
               artwork: libraryAlbum.cover || '',
            };

            if (!uniqueAlbums.has(id) || (!uniqueAlbums.get(id)?.artwork && album.artwork)) {
               uniqueAlbums.set(id, album);
            }
         });

         return Array.from(uniqueAlbums.values());
      } catch (error) {
         console.error('Error getting albums:', error);
         return [];
      }
   },

   getAlbumById: async (albumId: string) => {
      try {
         const albums = await MusicService.getAlbums();
         return albums.find(album => album.id === albumId) || null;
      } catch (error) {
         console.error('Error getting album by ID:', error);
         return null;
      }
   },

   getTracksByAlbumId: async (albumId: string) => {
      try {
         const allTracks = await DatabaseService.getAllTracks();
         const album = await MusicService.getAlbumById(albumId);

         if (!album) return [];

         // Filter tracks by album ID
         return allTracks.filter(track => track.album.id === albumId);
      } catch (error) {
         console.error('Error getting tracks by album ID:', error);
         return [];
      }
   },

   getPopularAlbums: async (limit: number = 3): Promise<Album[]> => {
      try {
         // Get all tracks
         const tracks = await DatabaseService.getAllTracks();

         // Count tracks per album
         const albumTrackCounts = new Map<string, number>();
         const albumData = new Map<string, Album>();

         tracks.forEach(track => {
            // Skip tracks that are invalid or should be excluded
            if (
               !track.url ||
               !track.album ||
               !track.artist ||
               musicMetadataUtils.shouldExcludeTrack(track.url)
            ) {
               return;
            }

            const albumId = track.album.id;
            const albumTitle = track.album.title || 'Unknown Album';
            const albumArtist = track.artist.name || 'Unknown Artist';

            // Skip albums with excluded patterns
            if (
               EXCLUDED_PATTERNS.some(
                  pattern =>
                     albumTitle.toLowerCase().includes(pattern) ||
                     albumArtist.toLowerCase().includes(pattern)
               )
            ) {
               return;
            }

            // Count tracks
            albumTrackCounts.set(albumId, (albumTrackCounts.get(albumId) || 0) + 1);

            // Store album data
            if (!albumData.has(albumId)) {
               albumData.set(albumId, {
                  id: albumId,
                  title: albumTitle,
                  artist: albumArtist,
                  artwork: track.album.artwork || track.artwork || '',
               });
            } else if (!albumData.get(albumId)?.artwork && (track.album.artwork || track.artwork)) {
               // If already exists but no artwork, update it
               const existingAlbum = albumData.get(albumId)!;
               albumData.set(albumId, {
                  ...existingAlbum,
                  artwork: track.album.artwork || track.artwork || '',
               });
            }
         });

         // Sort albums by track count and get top ones
         const topAlbumIds = [...albumTrackCounts.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(entry => entry[0]);

         // Get album data for top albums
         return topAlbumIds.map(id => albumData.get(id)!);
      } catch (error) {
         console.error('Error getting popular albums:', error);
         return [];
      }
   },
};
