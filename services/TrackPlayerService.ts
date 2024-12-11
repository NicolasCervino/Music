import TrackPlayer, { AppKilledPlaybackBehavior, Capability, Event, RepeatMode } from 'react-native-track-player';
import { Track } from '@/entities';
import { PlaybackService } from './PlaybackService';

export class TrackPlayerService {
  private static isInitialized = false;

  static async setupPlayer() {
    try {
      // Check if player is already initialized
      const isSetup = await TrackPlayer.isServiceRunning();
      if (isSetup) {
        this.isInitialized = true;
        return;
      }

      // Register playback service first
      await TrackPlayer.registerPlaybackService(() => PlaybackService);

      // Then setup the player
      await TrackPlayer.setupPlayer({
        autoHandleInterruptions: true,
      });

      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.Stop,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.Stop,
        ],
        android: {
          appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification
        },
      });

      this.isInitialized = true;
    } catch (error) {
      console.error('Error setting up player:', error);
      throw error;
    }
  }

  static async addTrack(track: Track) {
    try {
      if (!this.isInitialized) {
        await this.setupPlayer();
      }

      if (!track.audioUrl) {
        throw new Error('Track audioUrl is null or undefined');
      }

      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: track.id,
        url: track.audioUrl,
        title: track.title,
        artist: track.artist,
        artwork: track.artwork,
        duration: parseInt(track.duration) || 0,
      });
    } catch (error) {
      console.error('Error adding track:', error);
      console.error('Track details:', track);
      throw error;
    }
  }

  static async play() {
    try {
      await TrackPlayer.play();
    } catch (error) {
      console.error('Error playing track:', error);
    }
  }

  static async pause() {
    try {
      await TrackPlayer.pause();
    } catch (error) {
      console.error('Error pausing track:', error);
    }
  }

  static async stop() {
    try {
      await TrackPlayer.stop();
      await TrackPlayer.reset();
    } catch (error) {
      console.error('Error stopping track:', error);
    }
  }
} 