import { Track } from '@/entities';
import { Asset } from 'expo-asset';
import MusicInfo from 'expo-music-info-2';

const AUDIO_ASSETS = {
  'bad-habit.mp3': require('@/assets/audio/bad-habit.mp3'),
  'last-christmas.mp3': require('@/assets/audio/last-christmas.mp3'),
  'smooth-operator.mp3': require('@/assets/audio/smooth-operator.mp3'),
} as const;

export class MusicMetadataService {
  static async getTrackMetadata(fileUri: keyof typeof AUDIO_ASSETS): Promise<Track | null> {
    try {
      const asset = Asset.fromModule(AUDIO_ASSETS[fileUri]);
      await asset.downloadAsync();

      // Get metadata using expo-music-info
      // @ts-ignore - Known type definition issue in expo-music-info-2
      const metadata = await MusicInfo.getMusicInfoAsync(asset.localUri);

      return {
        id: fileUri,
        title: metadata.title || fileUri,
        artist: metadata.artist || 'Unknown Artist',
        artwork: metadata.picture ? `data:image/jpeg;base64,${metadata.picture}` : undefined,
        duration: '--:--',
        audioUrl: asset.localUri! // Changed from asset.uri to asset.localUri
      };
    } catch (error) {
      console.error('Error extracting metadata:', error);
      return null;
    }
  }

  static async getSampleTracks(): Promise<Track[]> {
    const audioFiles = Object.keys(AUDIO_ASSETS) as (keyof typeof AUDIO_ASSETS)[];

    const tracks = await Promise.all(
      audioFiles.map(async (uri) => {
        const metadata = await this.getTrackMetadata(uri);
        return metadata;
      })
    );

    return tracks.filter((track): track is Track => track !== null);
  }
}