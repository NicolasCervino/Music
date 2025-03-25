import { Track } from '@/entities';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class SongCacheService {
  private static SONGS_CACHE_KEY_PREFIX = '@cached_songs_chunk_';
  private static CACHE_TIMESTAMP_KEY = '@songs_cache_timestamp';
  private static CHUNKS_COUNT_KEY = '@songs_chunks_count';
  private static CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private static CHUNK_SIZE = 25; // Reduced for better cursor window compatibility
  private static MAX_CHUNKS = 20; // Increased number of chunks to maintain total capacity

  // Optimize track data even further
  private static minimizeTrackData(track: Track): Partial<Track> {
    // Remove any undefined or null values
    const minTrack: Partial<Track> = {
      id: track.id,
      title: track.title?.slice(0, 100) || '', // Limit title length
      artist: track.artist?.slice(0, 100) || '', // Limit artist length
      audioUrl: track.audioUrl,
      duration: track.duration,
    };

    // Only add artwork and album if they exist and aren't too long
    if (track.artwork && track.artwork.length < 200) {
      minTrack.artwork = track.artwork;
    }
    if (track.album && track.album.length < 100) {
      minTrack.album = track.album;
    }
    // Add the artwork color if it exists
    if (track.artworkColor) {
      minTrack.artworkColor = track.artworkColor;
    }

    return minTrack;
  }

  static async getCachedSongs(): Promise<Track[] | null> {
    try {
      const timestampStr = await AsyncStorage.getItem(this.CACHE_TIMESTAMP_KEY);
      const timestamp = timestampStr ? parseInt(timestampStr) : 0;
      
      if (Date.now() - timestamp > this.CACHE_DURATION) {
        await this.clearCache();
        return null;
      }

      const chunksCountStr = await AsyncStorage.getItem(this.CHUNKS_COUNT_KEY);
      if (!chunksCountStr) return null;

      const chunksCount = Math.min(parseInt(chunksCountStr), this.MAX_CHUNKS);
      let allSongs: Track[] = [];

      // Read chunks in smaller batches
      const BATCH_SIZE = 5;
      for (let batch = 0; batch < Math.ceil(chunksCount / BATCH_SIZE); batch++) {
        const batchStart = batch * BATCH_SIZE;
        const batchEnd = Math.min(batchStart + BATCH_SIZE, chunksCount);
        
        const batchPromises = [];
        for (let i = batchStart; i < batchEnd; i++) {
          batchPromises.push(AsyncStorage.getItem(`${this.SONGS_CACHE_KEY_PREFIX}${i}`));
        }

        const batchResults = await Promise.all(batchPromises);
        for (const chunkJson of batchResults) {
          if (chunkJson) {
            try {
              const chunk = JSON.parse(chunkJson);
              allSongs = allSongs.concat(chunk);
            } catch {
              // Silently skip chunks that can't be parsed
              continue;
            }
          }
        }
      }

      return allSongs.length > 0 ? allSongs : null;
    } catch (error: any) {
      // Only log critical errors
      if (error.code !== 13) {
        console.error('Error getting cached songs:', error);
      }
      return null;
    }
  }

  static async cacheSongs(songs: Track[]): Promise<void> {
    try {
      await this.clearCache();

      // Store only essential data for each track
      const minimizedSongs = songs
        .slice(0, this.CHUNK_SIZE * this.MAX_CHUNKS)
        .map(this.minimizeTrackData);

      const chunks = [];
      for (let i = 0; i < minimizedSongs.length; i += this.CHUNK_SIZE) {
        chunks.push(minimizedSongs.slice(i, i + this.CHUNK_SIZE));
      }

      const chunksToStore = chunks.slice(0, this.MAX_CHUNKS);

      // Store chunks sequentially instead of in parallel
      for (let i = 0; i < chunksToStore.length; i++) {
        try {
          await AsyncStorage.setItem(
            `${this.SONGS_CACHE_KEY_PREFIX}${i}`,
            JSON.stringify(chunksToStore[i])
          );
        } catch (error: any) {
          if (error.code === 13) {
            // If storage is full, stop storing more chunks
            console.warn(`Storage full after chunk ${i}`);
            await AsyncStorage.setItem(this.CHUNKS_COUNT_KEY, i.toString());
            return;
          }
          throw error;
        }
      }

      await AsyncStorage.setItem(this.CHUNKS_COUNT_KEY, chunksToStore.length.toString());
      await AsyncStorage.setItem(this.CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.error('Error caching songs:', error);
    }
  }

  static async clearCache(): Promise<void> {
    try {
      const chunksCountStr = await AsyncStorage.getItem(this.CHUNKS_COUNT_KEY);
      if (chunksCountStr) {
        const chunksCount = parseInt(chunksCountStr);
        const keys = Array.from(
          { length: chunksCount },
          (_, i) => `${this.SONGS_CACHE_KEY_PREFIX}${i}`
        );
        keys.push(this.CACHE_TIMESTAMP_KEY, this.CHUNKS_COUNT_KEY);
        await AsyncStorage.multiRemove(keys);
      }
    } catch (error) {
      console.error('Error clearing songs cache:', error);
    }
  }

  static async appendToCache(newSongs: Track[]): Promise<void> {
    try {
      const existingSongs = await this.getCachedSongs() || [];
      const updatedSongs = [...existingSongs, ...newSongs];
      await this.cacheSongs(updatedSongs);
    } catch (error) {
      console.error('Error appending to songs cache:', error);
    }
  }
} 