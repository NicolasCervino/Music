import TrackPlayer, { AppKilledPlaybackBehavior, Capability, Event, RepeatMode } from 'react-native-track-player';
import { Track } from '@/entities';
import { PlaybackService } from './PlaybackService';
import { usePlayerStore } from '@/store/usePlayerStore';

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

      await TrackPlayer.setRepeatMode(RepeatMode.Off);

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

  static async addToQueue(tracks: Track[], startIndex: number = 0) {
    try {
      if (!this.isInitialized) {
        await this.setupPlayer();
      }

      await TrackPlayer.reset();

      const queue = tracks.map(track => ({
        id: track.id,
        url: track.audioUrl,
        title: track.title,
        artist: track.artist,
        artwork: track.artwork,
        duration: parseInt(track.duration) || 0,
      }));

      await TrackPlayer.add(queue);
      await TrackPlayer.skip(startIndex);

      // Get the current track after skipping
      const currentTrack = await TrackPlayer.getCurrentTrack();
      if (currentTrack !== null) {
        const trackData = await TrackPlayer.getTrack(currentTrack);
        if (trackData) {
          usePlayerStore.getState().setCurrentTrack({
            id: trackData.id as string,
            title: trackData.title as string,
            artist: trackData.artist as string,
            artwork: trackData.artwork as string,
            duration: trackData.duration?.toString() || '--:--',
            audioUrl: trackData.url as string,
          });
        }
      }
    } catch (error) {
      console.error('Error adding tracks to queue:', error);
      throw error;
    }
  }

  static async skipToNext() {
    try {
      await TrackPlayer.skipToNext();
    } catch (error) {
      console.error('Error skipping to next track:', error);
    }
  }

  static async skipToPrevious() {
    try {
      await TrackPlayer.skipToPrevious();
    } catch (error) {
      console.error('Error skipping to previous track:', error);
    }
  }
} 