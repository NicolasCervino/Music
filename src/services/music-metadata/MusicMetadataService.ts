import { Album, Artist, Track } from '@/entities';
import * as MediaLibrary from 'expo-media-library';
import { getAlbums, getAll, SortSongFields, SortSongOrder } from 'react-native-get-music-files';
import { ColorService } from '../CacheColorService';
import { DatabaseService } from '../DatabaseService';
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
               return {
                  id: musicMetadataUtils.generateTrackId(song.url),
                  url: song.url,
                  title: song.title || 'Unknown Title',
                  album: song.album || 'Unknown Album',
                  artist: song.artist || 'Unknown Artist',
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
            const artistName = track.artist || 'Unknown Artist';

            // Generate a stable ID for the artist
            const artistId = `artist-${musicMetadataUtils.stableHash(artistName)}`;

            if (!artistsMap.has(artistId)) {
               // First time seeing this artist
               artistsMap.set(artistId, {
                  id: artistId,
                  name: artistName,
                  image: track.artwork || '', // Use first track's artwork
                  genres: [], // Initialize empty genres array
               });
            }

            // Update artist's tracks count & possibly genre info
            const artist = artistsMap.get(artistId)!;

            // If track has genre and it's not already in artist's genres, add it
            if (track.genre && !artist.genres.includes(track.genre)) {
               artist.genres = [...artist.genres, track.genre];
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
            const artistName = track.artist || 'Unknown Artist';
            const artistId = `artist-${musicMetadataUtils.stableHash(artistName)}`;

            // Count tracks
            artistTrackCounts.set(artistId, (artistTrackCounts.get(artistId) || 0) + 1);

            // Store artist data
            if (!artistData.has(artistId)) {
               artistData.set(artistId, {
                  id: artistId,
                  name: artistName,
                  image: track.artwork || '',
                  genres: track.genre ? [track.genre] : [],
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

         // Filtrar canciones por el nombre del artista
         return allTracks.filter(track => {
            const trackArtist = track.artist || '';
            return trackArtist.toLowerCase() === artist.name.toLowerCase();
         });
      } catch (error) {
         console.error('Error getting tracks by artist ID:', error);
         return [];
      }
   },

   getAlbums: async (): Promise<Album[]> => {
      try {
         // Primera estrategia: usar la base de datos de pistas para construir álbumes únicos
         // Esto garantiza que solo se incluyan álbumes de pistas que ya pasaron el filtrado
         const tracks = await DatabaseService.getAllTracks();

         if (tracks.length > 0) {
            const albumsMap = new Map<string, Album>();

            tracks.forEach(track => {
               // Aplicar el mismo filtro de exclusión que usamos para pistas individuales
               if (musicMetadataUtils.shouldExcludeTrack(track.url || '')) {
                  return;
               }

               const albumTitle = track.album || 'Unknown Album';
               const albumArtist = track.artist || 'Unknown Artist';

               // Ignorar álbumes con títulos genéricos de WhatsApp o cualquier patrón excluido
               if (
                  EXCLUDED_PATTERNS.some(
                     pattern =>
                        albumTitle.toLowerCase().includes(pattern) ||
                        albumArtist.toLowerCase().includes(pattern)
                  )
               ) {
                  return;
               }

               const albumId = `album-${musicMetadataUtils.stableHash(
                  albumTitle + '-' + albumArtist
               )}`;

               if (!albumsMap.has(albumId)) {
                  albumsMap.set(albumId, {
                     id: albumId,
                     title: albumTitle,
                     artist: albumArtist,
                     artwork: track.artwork || '',
                  });
               } else if (!albumsMap.get(albumId)?.artwork && track.artwork) {
                  const existingAlbum = albumsMap.get(albumId)!;
                  albumsMap.set(albumId, {
                     ...existingAlbum,
                     artwork: track.artwork,
                  });
               }
            });

            return Array.from(albumsMap.values());
         }

         // Estrategia alternativa (fallback): usar la API nativa
         // Solo si no tenemos pistas en la base de datos
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

            // Aplicar las mismas exclusiones que usamos para pistas
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

         // Filtrar canciones por título del álbum y artista
         return allTracks.filter(track => {
            const trackAlbum = track.album || '';
            const trackArtist = track.artist || '';
            return (
               trackAlbum.toLowerCase() === album.title.toLowerCase() &&
               trackArtist.toLowerCase() === album.artist.toLowerCase()
            );
         });
      } catch (error) {
         console.error('Error getting tracks by album ID:', error);
         return [];
      }
   },

   getPopularAlbums: async (limit: number = 3): Promise<Album[]> => {
      try {
         // Obtener todas las pistas
         const tracks = await DatabaseService.getAllTracks();

         // Contar pistas por álbum
         const albumTrackCounts = new Map<string, number>();
         const albumData = new Map<string, Album>();

         tracks.forEach(track => {
            // Ignorar pistas excluidas
            if (musicMetadataUtils.shouldExcludeTrack(track.url || '')) {
               return;
            }

            const albumTitle = track.album || 'Unknown Album';
            const albumArtist = track.artist || 'Unknown Artist';

            // Ignorar álbumes con títulos genéricos o patrones excluidos
            if (
               EXCLUDED_PATTERNS.some(
                  pattern =>
                     albumTitle.toLowerCase().includes(pattern) ||
                     albumArtist.toLowerCase().includes(pattern)
               )
            ) {
               return;
            }

            const albumId = `album-${musicMetadataUtils.stableHash(
               albumTitle + '-' + albumArtist
            )}`;

            // Contar pistas
            albumTrackCounts.set(albumId, (albumTrackCounts.get(albumId) || 0) + 1);

            // Almacenar datos del álbum
            if (!albumData.has(albumId)) {
               albumData.set(albumId, {
                  id: albumId,
                  title: albumTitle,
                  artist: albumArtist,
                  artwork: track.artwork || '',
               });
            } else if (!albumData.get(albumId)?.artwork && track.artwork) {
               // Si ya existe el álbum pero no tiene artwork, actualizarlo
               const existingAlbum = albumData.get(albumId)!;
               albumData.set(albumId, {
                  ...existingAlbum,
                  artwork: track.artwork,
               });
            }
         });

         // Ordenar álbumes por cantidad de pistas y obtener los principales
         const topAlbumIds = [...albumTrackCounts.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(entry => entry[0]);

         // Obtener datos de álbumes para los principales
         return topAlbumIds.map(id => albumData.get(id)!);
      } catch (error) {
         console.error('Error getting popular albums:', error);
         return [];
      }
   },
};
