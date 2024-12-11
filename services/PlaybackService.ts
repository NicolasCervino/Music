import TrackPlayer, { Event, State } from 'react-native-track-player';
import { usePlayerStore } from '@/store/usePlayerStore';

export async function PlaybackService() {
  // Existing event listeners
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.stop());
  TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
  TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious());

  // Add track change listeners
  TrackPlayer.addEventListener(Event.PlaybackTrackChanged, async (event) => {
    if (event.nextTrack !== null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      if (track) {
        usePlayerStore.getState().setCurrentTrack({
          id: track.id as string,
          title: track.title as string,
          artist: track.artist as string,
          artwork: track.artwork as string,
          duration: track.duration?.toString() || '--:--',
          audioUrl: track.url as string,
        });
      }
    }
  });

  // Add playback state listener
  TrackPlayer.addEventListener(Event.PlaybackState, (event) => {
    const isPlaying = event.state === State.Playing;
    usePlayerStore.getState().setIsPlaying(isPlaying);
  });
}