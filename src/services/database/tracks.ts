import { Track } from '@/entities';
import { db } from './base';
import { databaseUtils } from './utils';

export const saveTracks = (tracks: Track[]): Promise<void> => {
   return databaseUtils.runInTransaction(async () => {
      for (const track of tracks) {
         const query = `INSERT OR REPLACE INTO tracks 
          (id, url, title, artist_id, artist_name, artist_image, artist_genres, album_id, album_title, album_artist, album_artwork, duration, genre, artwork, audioUrl, artworkColor, lastModified, fileSize) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

         const params = [
            track.id,
            track.url || '',
            track.title || 'Unknown Title',
            track.artist.id,
            track.artist.name,
            track.artist.image || '',
            JSON.stringify(track.artist.genres || []),
            track.album.id,
            track.album.title,
            track.album.artist,
            track.album.artwork || '',
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
   });
};

export const getAllTracks = async (): Promise<Track[]> => {
   return databaseUtils.safeQuery(
      async () => {
         const result = await db.getAllAsync<Track>(`SELECT * FROM tracks ORDER BY title`);
         return result.map(databaseUtils.mapTrackFromDb);
      },
      'Error getting tracks from database:',
      []
   );
};

export const getPagedTracks = async (
   page: number,
   pageSize: number
): Promise<{ tracks: Track[]; total: number }> => {
   return databaseUtils.safeQuery(
      async () => {
         const countResult = await db.getAllAsync<{ count: number }>(
            `SELECT COUNT(*) as count FROM tracks`
         );
         const total = countResult[0].count;

         const query = `SELECT * FROM tracks ORDER BY title LIMIT ? OFFSET ?`;
         const params = [pageSize, page * pageSize];
         const result = await db.getAllAsync<Track>(query, params);

         return {
            tracks: result.map(databaseUtils.mapTrackFromDb),
            total,
         };
      },
      'Error getting paged tracks:',
      { tracks: [], total: 0 }
   );
};

export const hasStoredTracks = async (): Promise<boolean> => {
   return databaseUtils.safeQuery(
      async () => {
         const result = await db.getAllAsync<{ count: number }>(
            `SELECT COUNT(*) as count FROM tracks`
         );
         return result[0].count > 0;
      },
      'Error checking for tracks:',
      false
   );
};

export const clearTracks = async (): Promise<void> => {
   return databaseUtils.safeQuery(
      async () => {
         await db.execAsync(`DELETE FROM tracks`);
      },
      'Error clearing tracks:',
      undefined
   );
};
