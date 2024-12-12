import { usePlayerStore } from '@/store/usePlayerStore';
import TrackPlayer, { Event, State } from 'react-native-track-player';

export async function PlaybackService() {
  // Remote control events
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.stop());
  TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
  TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious());

  // Track change event
  TrackPlayer.addEventListener(Event.PlaybackTrackChanged, async (event) => {
    if (event.nextTrack !== null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      if (track) {
        const playerStore = usePlayerStore.getState();
        // Set the new track with all required properties
        playerStore.setCurrentTrack({
          id: track.id as string,
          title: track.title as string,
          artist: track.artist as string,
          artwork: track.artwork as string,
          duration: track.duration?.toString() || '--:--',
          audioUrl: track.url as string,
          album: track.album as string || 'Unknown Album',  // Add this
          genre: track.genre as string || 'Unknown Genre'   // Add this
        });
      
        // Only reset artwork loaded state if the artwork URL actually changed
        if (track.artwork !== playerStore.currentTrack?.artwork) {
          playerStore.setIsArtworkLoaded(false);
        }
      }
    }
  });

  // Playback state events
  TrackPlayer.addEventListener(Event.PlaybackState, (event) => {
    const isPlaying = event.state === State.Playing;
    usePlayerStore.getState().setIsPlaying(isPlaying);
  });

  // Error handling
  TrackPlayer.addEventListener(Event.PlaybackError, (error) => {
    console.error('Playback error:', error);
    usePlayerStore.getState().setIsPlaying(false);
  });

  // Queue ended event
  TrackPlayer.addEventListener(Event.PlaybackQueueEnded, (event) => {
    if (event.track !== null) {
      usePlayerStore.getState().setIsPlaying(false);
    }
  });
}