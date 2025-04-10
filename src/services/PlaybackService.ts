import { queryClient } from '@/clients/queryClient';
import TrackPlayer, { Event, State } from 'react-native-track-player';

export const PlaybackService = async function () {
   // Track change event
   TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, async event => {
      if (event.track !== null && event.track !== undefined) {
         queryClient.invalidateQueries({ queryKey: ['currentTrack'] });
      }
   });

   // Playback state events
   TrackPlayer.addEventListener(Event.PlaybackState, event => {
      queryClient.setQueryData(['playerState'], {
         isPlaying: event.state === State.Playing,
      });
   });

   // Remote control events
   TrackPlayer.addEventListener(Event.RemotePlay, () => {
      TrackPlayer.play();
   });

   TrackPlayer.addEventListener(Event.RemotePause, () => {
      TrackPlayer.pause();
   });

   TrackPlayer.addEventListener(Event.RemoteStop, () => {
      TrackPlayer.stop();
   });

   TrackPlayer.addEventListener(Event.RemoteNext, () => {
      TrackPlayer.skipToNext();
   });

   TrackPlayer.addEventListener(Event.RemotePrevious, () => {
      TrackPlayer.skipToPrevious();
   });

   // Error handling
   TrackPlayer.addEventListener(Event.PlaybackError, error => {
      console.error('Playback error:', error);
   });
};
