import { Track } from '@/entities';
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
      ).then(() => {
        resolve();
      }).catch(error => {
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
          track.fileSize || null
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
        fileSize: item.fileSize
      };
    });
  } catch (error) {
    console.error('Error getting tracks from database:', error);
    return [];
  }
};

const getPagedTracks = async (page: number, pageSize: number): Promise<{tracks: Track[], total: number}> => {
  try {
    const countResult = await db.getAllAsync<{count: number}>(`SELECT COUNT(*) as count FROM tracks`);
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
        fileSize: item.fileSize
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
    const result = await db.getAllAsync<{count: number}>(`SELECT COUNT(*) as count FROM tracks`);
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

export const DatabaseService = {
  initDatabase,
  saveTracks,
  getAllTracks,
  getPagedTracks,
  hasStoredTracks,
  clearTracks
}; 