import { Track } from '@/entities';
import TrackPlayer, { AppKilledPlaybackBehavior, Capability, RepeatMode } from 'react-native-track-player';
import { PlaybackService } from './PlaybackService';

let isInitialized = false;

export const PlayerService = {
  setupPlayer: async (): Promise<void> => {
    try {
      // Check if player is already initialized
      const isSetup = await TrackPlayer.isServiceRunning();
      if (isSetup) {
        isInitialized = true;
        return;
      }

      // Register playback service
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
      isInitialized = true;
    } catch (error) {
      console.error('Error setting up player:', error);
      throw error;
    }
  },

  play: async (): Promise<void> => {
    await TrackPlayer.play();
  },

  pause: async (): Promise<void> => {
    await TrackPlayer.pause();
  },

  stop: async (): Promise<void> => {
    await TrackPlayer.stop();
    await TrackPlayer.reset();
  },

  playTrack: async (track: Track, allTracks: Track[], startIndex?: number): Promise<void> => {
    if (!isInitialized) {
      await PlayerService.setupPlayer();
    }

    // Find track index if not provided
    const trackIndex = startIndex ?? allTracks.findIndex(t => t.id === track.id);
    if (trackIndex === -1) return;

    // Reset queue and add all tracks
    await TrackPlayer.reset();
    
    const queue = allTracks.map(track => ({
      id: track.id, // Important! Use the exact same ID as in the Track object
      url: track.audioUrl,
      title: track.title,
      artist: track.artist,
      artwork: track.artwork,
      duration: parseInt(track.duration) || 0,
      album: track.album,
      genre: track.genre,
      artworkColor: track.artworkColor
    }));

    await TrackPlayer.add(queue);
    await TrackPlayer.skip(trackIndex);
    await PlayerService.play();
  },

  skipToNext: async (): Promise<void> => {
    await TrackPlayer.skipToNext();
  },

  skipToPrevious: async (): Promise<void> => {
    await TrackPlayer.skipToPrevious();
  },

  getCurrentTrack: async (): Promise<Track | null> => {
    const trackIndex = await TrackPlayer.getCurrentTrack();
    if (trackIndex === null) return null;
    
    const trackData = await TrackPlayer.getTrack(trackIndex);
    if (!trackData) return null;
    
    // Return the track with the exact same ID as was added to the queue
    return {
      id: trackData.id as string, // Critical to keep exactly as is
      url: trackData.url as string, // Include URL to help with matching
      title: trackData.title as string,
      artist: trackData.artist as string,
      artwork: trackData.artwork as string,
      duration: trackData.duration?.toString() || '--:--',
      audioUrl: trackData.url as string,
      album: trackData.album as string,
      genre: trackData.genre as string,
      artworkColor: trackData.artworkColor as string,
    };
  },

  toggleRepeatMode: async (): Promise<RepeatMode> => {
    const currentMode = await TrackPlayer.getRepeatMode();
    
    let nextMode: RepeatMode;
    switch (currentMode) {
      case RepeatMode.Off:
        nextMode = RepeatMode.Queue;
        break;
      case RepeatMode.Queue:
        nextMode = RepeatMode.Track;
        break;
      default:
        nextMode = RepeatMode.Off;
    }
    
    await TrackPlayer.setRepeatMode(nextMode);
    return nextMode;
  },

  getRepeatMode: async (): Promise<RepeatMode> => {
    return await TrackPlayer.getRepeatMode();
  }
};