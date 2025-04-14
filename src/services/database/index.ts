import { initDatabase } from './base';
import * as playlistOperations from './playlists';
import * as trackOperations from './tracks';

export const DatabaseService = {
   initDatabase,
   // Track operations
   ...trackOperations,
   // Playlist operations
   ...playlistOperations,
};
