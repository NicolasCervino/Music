import { Playlist, Track } from '@/entities';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('musicapp.db');

const initDatabase = (): Promise<void> => {
   return new Promise((resolve, reject) => {
      try {
         db.execAsync(
            `CREATE TABLE IF NOT EXISTS tracks (
          id TEXT PRIMARY KEY,
          url TEXT NOT NULL,
          title TEXT NOT NULL,
          artist TEXT NOT NULL,
          album TEXT,
          duration TEXT,
          genre TEXT,
          artwork TEXT,
          audioUrl TEXT NOT NULL,
          artworkColor TEXT,
          lastModified INTEGER,
          fileSize INTEGER
        )`
         )
            .then(() => {
               return db.execAsync(
                  `CREATE TABLE IF NOT EXISTS playlists (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            createdAt INTEGER NOT NULL,
            updatedAt INTEGER NOT NULL,
            coverArt TEXT
          )`
               );
            })
            .then(() => {
               return db.execAsync(
                  `CREATE TABLE IF NOT EXISTS playlist_tracks (
            playlistId TEXT NOT NULL,
            trackId TEXT NOT NULL,
            position INTEGER NOT NULL,
            PRIMARY KEY (playlistId, trackId),
            FOREIGN KEY (playlistId) REFERENCES playlists (id) ON DELETE CASCADE,
            FOREIGN KEY (trackId) REFERENCES tracks (id) ON DELETE CASCADE
          )`
               );
            })
            .then(() => {
               resolve();
            })
            .catch(error => {
               console.error('Error initializing database:', error);
               reject(error);
            });
      } catch (error) {
         console.error('Error in database transaction:', error);
         reject(error);
      }
   });
};

const saveTracks = (tracks: Track[]): Promise<void> => {
   return new Promise(async (resolve, reject) => {
      try {
         await db.runAsync('BEGIN TRANSACTION');

         for (const track of tracks) {
            const query = `INSERT OR REPLACE INTO tracks 
          (id, url, title, artist, album, duration, genre, artwork, audioUrl, artworkColor, lastModified, fileSize) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const params = [
               track.id,
               track.url || '',
               track.title || 'Unknown Title',
               track.artist || 'Unknown Artist',
               track.album || '',
               track.duration || '',
               track.genre || '',
               track.artwork || '',
               track.audioUrl || '',
               track.artworkColor || '',
               track.lastModified || null,
               track.fileSize || null,
            ];

            await db.runAsync(query, params);
         }

         await db.runAsync('COMMIT');
         resolve();
      } catch (error) {
         await db.runAsync('ROLLBACK');
         console.error('Error saving tracks:', error);
         reject(error);
      }
   });
};

const getAllTracks = async (): Promise<Track[]> => {
   try {
      const result = await db.getAllAsync<Track>(`SELECT * FROM tracks ORDER BY title`);
      return result.map(item => {
         const audioUrl = item.audioUrl || item.url || '';

         return {
            id: item.id,
            url: item.url,
            title: item.title,
            artist: item.artist,
            album: item.album,
            duration: item.duration,
            genre: item.genre,
            artwork: item.artwork,
            audioUrl: audioUrl,
            artworkColor: item.artworkColor,
            lastModified: item.lastModified,
            fileSize: item.fileSize,
         };
      });
   } catch (error) {
      console.error('Error getting tracks from database:', error);
      return [];
   }
};

const getPagedTracks = async (
   page: number,
   pageSize: number
): Promise<{ tracks: Track[]; total: number }> => {
   try {
      const countResult = await db.getAllAsync<{ count: number }>(
         `SELECT COUNT(*) as count FROM tracks`
      );
      const total = countResult[0].count;

      const query = `SELECT * FROM tracks ORDER BY title LIMIT ? OFFSET ?`;
      const params = [pageSize, page * pageSize];
      const result = await db.getAllAsync<Track>(query, params);

      const tracks = result.map(item => {
         const audioUrl = item.audioUrl || item.url || '';

         return {
            id: item.id,
            url: item.url,
            title: item.title,
            artist: item.artist,
            album: item.album,
            duration: item.duration,
            genre: item.genre,
            artwork: item.artwork,
            audioUrl: audioUrl,
            artworkColor: item.artworkColor,
            lastModified: item.lastModified,
            fileSize: item.fileSize,
         };
      });

      return { tracks, total };
   } catch (error) {
      console.error('Error getting paged tracks:', error);
      return { tracks: [], total: 0 };
   }
};

const hasStoredTracks = async (): Promise<boolean> => {
   try {
      const result = await db.getAllAsync<{ count: number }>(
         `SELECT COUNT(*) as count FROM tracks`
      );
      return result[0].count > 0;
   } catch (error) {
      console.error('Error checking for tracks:', error);
      return false;
   }
};

const clearTracks = async (): Promise<void> => {
   try {
      await db.execAsync(`DELETE FROM tracks`);
   } catch (error) {
      console.error('Error clearing tracks:', error);
      throw error;
   }
};

// Playlist functions
const createPlaylist = async (playlist: Omit<Playlist, 'id'>): Promise<Playlist> => {
   try {
      const id =
         'playlist_' + Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9);
      const newPlaylist: Playlist = {
         ...playlist,
         id,
         trackIds: playlist.trackIds || [],
      };

      await db.runAsync(
         `INSERT INTO playlists (id, name, description, createdAt, updatedAt, coverArt) 
       VALUES (?, ?, ?, ?, ?, ?)`,
         [
            newPlaylist.id,
            newPlaylist.name,
            newPlaylist.description || '',
            newPlaylist.createdAt,
            newPlaylist.updatedAt,
            newPlaylist.coverArt || '',
         ]
      );

      if (newPlaylist.trackIds.length > 0) {
         await db.runAsync('BEGIN TRANSACTION');

         for (let i = 0; i < newPlaylist.trackIds.length; i++) {
            await db.runAsync(
               `INSERT INTO playlist_tracks (playlistId, trackId, position) 
           VALUES (?, ?, ?)`,
               [newPlaylist.id, newPlaylist.trackIds[i], i]
            );
         }

         await db.runAsync('COMMIT');
      }

      return newPlaylist;
   } catch (error) {
      await db.runAsync('ROLLBACK');
      console.error('Error creating playlist:', error);
      throw error;
   }
};

const updatePlaylist = async (playlist: Playlist): Promise<Playlist> => {
   try {
      const updatedPlaylist: Playlist = {
         ...playlist,
         updatedAt: Date.now(),
      };

      await db.runAsync(
         `UPDATE playlists 
       SET name = ?, description = ?, updatedAt = ?, coverArt = ? 
       WHERE id = ?`,
         [
            updatedPlaylist.name,
            updatedPlaylist.description || '',
            updatedPlaylist.updatedAt,
            updatedPlaylist.coverArt || '',
            updatedPlaylist.id,
         ]
      );

      // Update playlist tracks (remove all and re-add)
      await db.runAsync('BEGIN TRANSACTION');

      // First delete all existing relations
      await db.runAsync(`DELETE FROM playlist_tracks WHERE playlistId = ?`, [updatedPlaylist.id]);

      // Then add new ones
      for (let i = 0; i < updatedPlaylist.trackIds.length; i++) {
         await db.runAsync(
            `INSERT INTO playlist_tracks (playlistId, trackId, position) 
         VALUES (?, ?, ?)`,
            [updatedPlaylist.id, updatedPlaylist.trackIds[i], i]
         );
      }

      await db.runAsync('COMMIT');

      return updatedPlaylist;
   } catch (error) {
      await db.runAsync('ROLLBACK');
      console.error('Error updating playlist:', error);
      throw error;
   }
};

const deletePlaylist = async (playlistId: string): Promise<void> => {
   try {
      await db.runAsync('BEGIN TRANSACTION');

      // Delete playlist tracks first
      await db.runAsync(`DELETE FROM playlist_tracks WHERE playlistId = ?`, [playlistId]);

      // Then delete the playlist
      await db.runAsync(`DELETE FROM playlists WHERE id = ?`, [playlistId]);

      await db.runAsync('COMMIT');
   } catch (error) {
      await db.runAsync('ROLLBACK');
      console.error('Error deleting playlist:', error);
      throw error;
   }
};

const getPlaylists = async (): Promise<Playlist[]> => {
   try {
      const playlists = await db.getAllAsync<Omit<Playlist, 'trackIds'>>(
         `SELECT * FROM playlists ORDER BY updatedAt DESC`
      );

      // For each playlist, get track IDs
      const result: Playlist[] = [];

      for (const playlist of playlists) {
         const trackRelations = await db.getAllAsync<{ trackId: string; position: number }>(
            `SELECT trackId, position FROM playlist_tracks 
         WHERE playlistId = ? 
         ORDER BY position ASC`,
            [playlist.id]
         );

         const trackIds = trackRelations.map(rel => rel.trackId);

         // If the playlist has no artwork but has tracks, use the first track's artwork
         let coverArt = playlist.coverArt;
         if (!coverArt && trackIds.length > 0) {
            const firstTrack = await db.getAllAsync<{ artwork: string }>(
               'SELECT artwork FROM tracks WHERE id = ?',
               [trackIds[0]]
            );
            if (firstTrack.length > 0 && firstTrack[0].artwork) {
               coverArt = firstTrack[0].artwork;
            }
         }

         result.push({
            ...playlist,
            trackIds,
            coverArt,
         });
      }

      return result;
   } catch (error) {
      console.error('Error getting playlists:', error);
      return [];
   }
};

const getPlaylistById = async (playlistId: string): Promise<Playlist | null> => {
   try {
      const playlists = await db.getAllAsync<Omit<Playlist, 'trackIds'>>(
         `SELECT * FROM playlists WHERE id = ?`,
         [playlistId]
      );

      if (playlists.length === 0) {
         return null;
      }

      const playlist = playlists[0];

      // Get track IDs
      const trackRelations = await db.getAllAsync<{ trackId: string; position: number }>(
         `SELECT trackId, position FROM playlist_tracks 
       WHERE playlistId = ? 
       ORDER BY position ASC`,
         [playlistId]
      );

      const trackIds = trackRelations.map(rel => rel.trackId);

      // If the playlist has no artwork but has tracks, use the first track's artwork
      let coverArt = playlist.coverArt;
      if (!coverArt && trackIds.length > 0) {
         const firstTrack = await db.getAllAsync<{ artwork: string }>(
            'SELECT artwork FROM tracks WHERE id = ?',
            [trackIds[0]]
         );
         if (firstTrack.length > 0 && firstTrack[0].artwork) {
            coverArt = firstTrack[0].artwork;
         }
      }

      return {
         ...playlist,
         trackIds,
         coverArt,
      };
   } catch (error) {
      console.error('Error getting playlist by ID:', error);
      return null;
   }
};

const getPlaylistTracks = async (playlistId: string): Promise<Track[]> => {
   try {
      const tracks = await db.getAllAsync<Track>(
         `SELECT t.* FROM tracks t
       JOIN playlist_tracks pt ON t.id = pt.trackId
       WHERE pt.playlistId = ?
       ORDER BY pt.position ASC`,
         [playlistId]
      );

      return tracks.map(item => {
         const audioUrl = item.audioUrl || item.url || '';

         return {
            id: item.id,
            url: item.url,
            title: item.title,
            artist: item.artist,
            album: item.album,
            duration: item.duration,
            genre: item.genre,
            artwork: item.artwork,
            audioUrl: audioUrl,
            artworkColor: item.artworkColor,
            lastModified: item.lastModified,
            fileSize: item.fileSize,
         };
      });
   } catch (error) {
      console.error('Error getting playlist tracks:', error);
      return [];
   }
};

const addTrackToPlaylist = async (playlistId: string, trackId: string): Promise<void> => {
   try {
      // First, get the current highest position
      const positions = await db.getAllAsync<{ maxPosition: number }>(
         `SELECT MAX(position) as maxPosition FROM playlist_tracks WHERE playlistId = ?`,
         [playlistId]
      );

      const position = positions[0]?.maxPosition !== null ? positions[0].maxPosition + 1 : 0;

      // Add the track
      await db.runAsync(
         `INSERT OR IGNORE INTO playlist_tracks (playlistId, trackId, position) 
       VALUES (?, ?, ?)`,
         [playlistId, trackId, position]
      );

      // Update playlist's updatedAt
      await db.runAsync(`UPDATE playlists SET updatedAt = ? WHERE id = ?`, [
         Date.now(),
         playlistId,
      ]);
   } catch (error) {
      console.error('Error adding track to playlist:', error);
      throw error;
   }
};

const removeTrackFromPlaylist = async (playlistId: string, trackId: string): Promise<void> => {
   try {
      await db.runAsync('BEGIN TRANSACTION');

      // Get the position of the track we're removing
      const positions = await db.getAllAsync<{ position: number }>(
         `SELECT position FROM playlist_tracks WHERE playlistId = ? AND trackId = ?`,
         [playlistId, trackId]
      );

      if (positions.length === 0) {
         await db.runAsync('ROLLBACK');
         return;
      }

      const removedPosition = positions[0].position;

      // Remove the track
      await db.runAsync(`DELETE FROM playlist_tracks WHERE playlistId = ? AND trackId = ?`, [
         playlistId,
         trackId,
      ]);

      // Update positions of remaining tracks
      await db.runAsync(
         `UPDATE playlist_tracks 
       SET position = position - 1 
       WHERE playlistId = ? AND position > ?`,
         [playlistId, removedPosition]
      );

      // Update playlist's updatedAt
      await db.runAsync(`UPDATE playlists SET updatedAt = ? WHERE id = ?`, [
         Date.now(),
         playlistId,
      ]);

      await db.runAsync('COMMIT');
   } catch (error) {
      await db.runAsync('ROLLBACK');
      console.error('Error removing track from playlist:', error);
      throw error;
   }
};

const reorderPlaylistTracks = async (playlistId: string, trackIds: string[]): Promise<void> => {
   try {
      await db.runAsync('BEGIN TRANSACTION');

      // Delete existing order
      await db.runAsync(`DELETE FROM playlist_tracks WHERE playlistId = ?`, [playlistId]);

      // Insert new order
      for (let i = 0; i < trackIds.length; i++) {
         await db.runAsync(
            `INSERT INTO playlist_tracks (playlistId, trackId, position) 
         VALUES (?, ?, ?)`,
            [playlistId, trackIds[i], i]
         );
      }

      // Update playlist's updatedAt
      await db.runAsync(`UPDATE playlists SET updatedAt = ? WHERE id = ?`, [
         Date.now(),
         playlistId,
      ]);

      await db.runAsync('COMMIT');
   } catch (error) {
      await db.runAsync('ROLLBACK');
      console.error('Error reordering playlist tracks:', error);
      throw error;
   }
};

export const DatabaseService = {
   initDatabase,
   saveTracks,
   getAllTracks,
   getPagedTracks,
   hasStoredTracks,
   clearTracks,
   // Playlist functions
   createPlaylist,
   updatePlaylist,
   deletePlaylist,
   getPlaylists,
   getPlaylistById,
   getPlaylistTracks,
   addTrackToPlaylist,
   removeTrackFromPlaylist,
   reorderPlaylistTracks,
};
