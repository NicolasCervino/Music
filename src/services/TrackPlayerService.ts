import { Album, Artist, Track } from '@/entities';
import TrackPlayer, {
   AppKilledPlaybackBehavior,
   Capability,
   RepeatMode,
} from 'react-native-track-player';
import { PlaybackService } from './PlaybackService';

let isInitialized = false;

export const PlayerService = {
   setupPlayer: async (): Promise<void> => {
      try {
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
            compactCapabilities: [Capability.Play, Capability.Pause, Capability.Stop],
            android: {
               appKilledPlaybackBehavior:
                  AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
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
      try {
         if (!isInitialized) {
            await PlayerService.setupPlayer();
         }

         const trackIndex = startIndex ?? allTracks.findIndex(t => t.id === track.id);
         if (trackIndex === -1) {
            console.error(`[PLAYER] Track not found in allTracks array: ${track.id}`);
            return;
         }

         await TrackPlayer.reset();

         const queue = allTracks.map(track => {
            const audioUrl = track.audioUrl || track.url || '';
            return {
               id: track.id,
               url: audioUrl,
               title: track.title,
               artist: track.artist.name,
               artwork: track.artwork ? (track.artwork as string) : undefined,
               duration: parseInt(track.duration) || 0,
               album: track.album.title,
               genre: track.genre,
               artworkColor: track.artworkColor,
               artistId: track.artist.id,
               albumId: track.album.id,
            };
         });

         await TrackPlayer.add(queue);
         await TrackPlayer.skip(trackIndex);
         await PlayerService.play();
      } catch (error) {
         console.error('[PLAYER] Error playing track:', error);
      }
   },

   skipToNext: async (): Promise<void> => {
      await TrackPlayer.skipToNext();
   },

   skipToPrevious: async (): Promise<void> => {
      await TrackPlayer.skipToPrevious();
   },

   getCurrentTrack: async (): Promise<Track | null> => {
      try {
         const trackIndex = await TrackPlayer.getCurrentTrack();
         if (trackIndex === null) return null;

         const trackData = await TrackPlayer.getTrack(trackIndex);
         if (!trackData) return null;

         const artist: Artist = {
            id: (trackData.artistId as string) || `artist-unknown`,
            name: trackData.artist as string,
            image: (trackData.artwork as string) || '',
            genres: [],
         };

         const album: Album = {
            id: (trackData.albumId as string) || `album-unknown`,
            title: trackData.album as string,
            artist: trackData.artist as string,
            artwork: (trackData.artwork as string) || '',
         };

         return {
            id: trackData.id as string,
            url: trackData.url as string,
            title: trackData.title as string,
            artist,
            artwork: trackData.artwork ? (trackData.artwork as string) : undefined,
            duration: trackData.duration?.toString() || '--:--',
            audioUrl: trackData.url as string,
            album,
            genre: trackData.genre as string,
            artworkColor: trackData.artworkColor as string,
         };
      } catch (error) {
         console.error('[PLAYER] Error getting current track:', error);
         return null;
      }
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
   },
};
