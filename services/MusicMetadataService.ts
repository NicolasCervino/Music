import { Track } from '@/entities';
import { Asset } from 'expo-asset';
/* import MusicInfo from 'expo-music-info-2'; */
import { getAll, SortSongFields, SortSongOrder } from 'react-native-get-music-files';
import * as MediaLibrary from 'expo-media-library';

const AUDIO_ASSETS = {
  'bad-habit.mp3': require('@/assets/audio/bad-habit.mp3'),
  'last-christmas.mp3': require('@/assets/audio/last-christmas.mp3'),
  'smooth-operator.mp3': require('@/assets/audio/smooth-operator.mp3'),
  'smooth-criminal.mp3': require('@/assets/audio/smooth-criminal.mp3'),
} as const;

export class MusicMetadataService {
  private static PAGE_SIZE = 20;

  private static formatDuration(durationMs: number): string {
    // Convert to seconds
    const totalSeconds = Math.floor(durationMs / 1000);

    // Calculate minutes and remaining seconds
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Pad seconds with leading zero if needed
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  static async getAllTracks(page: number = 0): Promise<{ tracks: Track[], hasMore: boolean }> {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission not granted');
      }

      const songsOrError = await getAll({
        coverQuality: 50,
        minSongDuration: 1000,
        sortBy: SortSongFields.TITLE,
        sortOrder: SortSongOrder.ASC,
        offset: page * this.PAGE_SIZE,
        limit: this.PAGE_SIZE,
      });

      if (typeof songsOrError === 'string') {
        console.error('Error getting music files:', songsOrError);
        return { tracks: [], hasMore: false };
      }

      const tracks = songsOrError.map((song): Track => ({
        id: song.url,
        title: song.title,
        album: song.album,
        artist: song.artist,
        duration: this.formatDuration(song.duration),
        genre: song.genre,
        artwork: song.cover || undefined,
        audioUrl: song.url
      }))

      return {
        tracks,
        hasMore: tracks.length >= this.PAGE_SIZE
      };
    } catch (error) {
      console.error('Error getting tracks:', error);
      return { tracks: [], hasMore: false };
    }
  }
}