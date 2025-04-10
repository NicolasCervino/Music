import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('musicapp.db');

export const initDatabase = (): Promise<void> => {
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
