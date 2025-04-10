import { Track } from '@/entities';
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
