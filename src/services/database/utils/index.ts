import { Album, Artist, Track } from '@/entities';
import { db } from '../base';

const runInTransaction = async <T>(operations: () => Promise<T>): Promise<T> => {
   try {
      await db.runAsync('BEGIN TRANSACTION');
      const result = await operations();
      await db.runAsync('COMMIT');
      return result;
   } catch (error) {
      await db.runAsync('ROLLBACK');
      console.error('Transaction failed:', error);
      throw error;
   }
};

const mapTrackFromDb = (item: any): Track => {
   const audioUrl = item.audioUrl || item.url || '';

   // Reconstruct Artist object
   const artist: Artist = {
      id: item.artist_id,
      name: item.artist_name,
      image: item.artist_image || '',
      genres: item.artist_genres ? JSON.parse(item.artist_genres) : [],
   };

   // Reconstruct Album object
   const album: Album = {
      id: item.album_id,
      title: item.album_title,
      artist: item.album_artist,
      artwork: item.album_artwork || '',
   };

   return {
      id: item.id,
      url: item.url,
      title: item.title,
      artist,
      album,
      duration: item.duration,
      genre: item.genre,
      artwork: item.artwork,
      audioUrl: audioUrl,
      artworkColor: item.artworkColor,
      lastModified: item.lastModified,
      fileSize: item.fileSize,
   };
};

const safeQuery = async <T>(
   operation: () => Promise<T>,
   errorMessage: string,
   defaultValue: T
): Promise<T> => {
   try {
      return await operation();
   } catch (error) {
      console.error(errorMessage, error);
      return defaultValue;
   }
};

export const databaseUtils = {
   runInTransaction,
   mapTrackFromDb,
   safeQuery,
};
