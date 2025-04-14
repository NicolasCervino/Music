import { Playlist, Track } from '@/entities';
import { db } from './base';
import { databaseUtils } from './utils';

export const createPlaylist = async (playlist: Omit<Playlist, 'id'>): Promise<Playlist> => {
   return databaseUtils.safeQuery(
      async () => {
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
            await databaseUtils.runInTransaction(async () => {
               for (let i = 0; i < newPlaylist.trackIds.length; i++) {
                  await db.runAsync(
                     `INSERT INTO playlist_tracks (playlistId, trackId, position) 
                     VALUES (?, ?, ?)`,
                     [newPlaylist.id, newPlaylist.trackIds[i], i]
                  );
               }
            });
         }

         return newPlaylist;
      },
      'Error creating playlist:',
      null as any
   );
};

export const updatePlaylist = async (playlist: Playlist): Promise<Playlist> => {
   return databaseUtils.safeQuery(
      async () => {
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

         await databaseUtils.runInTransaction(async () => {
            await db.runAsync(`DELETE FROM playlist_tracks WHERE playlistId = ?`, [
               updatedPlaylist.id,
            ]);

            for (let i = 0; i < updatedPlaylist.trackIds.length; i++) {
               await db.runAsync(
                  `INSERT INTO playlist_tracks (playlistId, trackId, position) 
                  VALUES (?, ?, ?)`,
                  [updatedPlaylist.id, updatedPlaylist.trackIds[i], i]
               );
            }
         });

         return updatedPlaylist;
      },
      'Error updating playlist:',
      null as any
   );
};

export const deletePlaylist = async (playlistId: string): Promise<void> => {
   return databaseUtils.runInTransaction(async () => {
      await db.runAsync(`DELETE FROM playlist_tracks WHERE playlistId = ?`, [playlistId]);

      await db.runAsync(`DELETE FROM playlists WHERE id = ?`, [playlistId]);
   });
};

export const getPlaylists = async (): Promise<Playlist[]> => {
   return databaseUtils.safeQuery(
      async () => {
         const playlists = await db.getAllAsync<Omit<Playlist, 'trackIds'>>(
            `SELECT * FROM playlists ORDER BY updatedAt DESC`
         );
         const result: Playlist[] = [];

         for (const playlist of playlists) {
            const trackRelations = await db.getAllAsync<{ trackId: string; position: number }>(
               `SELECT trackId, position FROM playlist_tracks 
               WHERE playlistId = ? 
               ORDER BY position ASC`,
               [playlist.id]
            );

            const trackIds = trackRelations.map(rel => rel.trackId);

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
      },
      'Error getting playlists:',
      []
   );
};

export const getPlaylistById = async (playlistId: string): Promise<Playlist | null> => {
   return databaseUtils.safeQuery(
      async () => {
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
      },
      'Error getting playlist by ID:',
      null
   );
};

export const getPlaylistTracks = async (playlistId: string): Promise<Track[]> => {
   return databaseUtils.safeQuery(
      async () => {
         const tracks = await db.getAllAsync<Track>(
            `SELECT t.* FROM tracks t
            JOIN playlist_tracks pt ON t.id = pt.trackId
            WHERE pt.playlistId = ?
            ORDER BY pt.position ASC`,
            [playlistId]
         );

         return tracks.map(databaseUtils.mapTrackFromDb);
      },
      'Error getting playlist tracks:',
      []
   );
};

export const addTrackToPlaylist = async (playlistId: string, trackId: string): Promise<void> => {
   return databaseUtils.safeQuery(
      async () => {
         const positions = await db.getAllAsync<{ maxPosition: number }>(
            `SELECT MAX(position) as maxPosition FROM playlist_tracks WHERE playlistId = ?`,
            [playlistId]
         );

         const position = positions[0]?.maxPosition !== null ? positions[0].maxPosition + 1 : 0;

         await db.runAsync(
            `INSERT OR IGNORE INTO playlist_tracks (playlistId, trackId, position) 
            VALUES (?, ?, ?)`,
            [playlistId, trackId, position]
         );

         await db.runAsync(`UPDATE playlists SET updatedAt = ? WHERE id = ?`, [
            Date.now(),
            playlistId,
         ]);
      },
      'Error adding track to playlist:',
      undefined
   );
};

export const removeTrackFromPlaylist = async (
   playlistId: string,
   trackId: string
): Promise<void> => {
   return databaseUtils.runInTransaction(async () => {
      const positions = await db.getAllAsync<{ position: number }>(
         `SELECT position FROM playlist_tracks WHERE playlistId = ? AND trackId = ?`,
         [playlistId, trackId]
      );

      if (positions.length === 0) {
         return;
      }

      const removedPosition = positions[0].position;

      await db.runAsync(`DELETE FROM playlist_tracks WHERE playlistId = ? AND trackId = ?`, [
         playlistId,
         trackId,
      ]);

      await db.runAsync(
         `UPDATE playlist_tracks 
         SET position = position - 1 
         WHERE playlistId = ? AND position > ?`,
         [playlistId, removedPosition]
      );

      await db.runAsync(`UPDATE playlists SET updatedAt = ? WHERE id = ?`, [
         Date.now(),
         playlistId,
      ]);
   });
};

export const reorderPlaylistTracks = async (
   playlistId: string,
   trackIds: string[]
): Promise<void> => {
   return databaseUtils.runInTransaction(async () => {
      await db.runAsync(`DELETE FROM playlist_tracks WHERE playlistId = ?`, [playlistId]);

      for (let i = 0; i < trackIds.length; i++) {
         await db.runAsync(
            `INSERT INTO playlist_tracks (playlistId, trackId, position) 
            VALUES (?, ?, ?)`,
            [playlistId, trackIds[i], i]
         );
      }

      await db.runAsync(`UPDATE playlists SET updatedAt = ? WHERE id = ?`, [
         Date.now(),
         playlistId,
      ]);
   });
};
