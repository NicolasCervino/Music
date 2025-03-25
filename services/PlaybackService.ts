import { ColorCacheService } from '@/services/CacheColorService';
import { usePlayerStore } from '@/store/usePlayerStore';
import TrackPlayer, { Event, State } from 'react-native-track-player';

export const PlaybackService = async function() {
  // Remote control events
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    usePlayerStore.getState().setIsPlaying(true);
  });

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    usePlayerStore.getState().setIsPlaying(false);
  });

  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    usePlayerStore.getState().stopTrack();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    usePlayerStore.getState().nextTrack();
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    usePlayerStore.getState().previousTrack();
  });

  // Track change event
  TrackPlayer.addEventListener(Event.PlaybackTrackChanged, async (event) => {
    if (event.nextTrack !== null && event.nextTrack !== undefined) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      if (track) {
        const newTrack = {
          id: track.id as string,
          title: track.title as string,
          artist: track.artist as string,
          artwork: track.artwork as string,
          duration: track.duration?.toString() || '--:--',
          audioUrl: track.url as string,
          album: track.album as string,
          genre: track.genre as string,
        };
        
        // Update the current track
        usePlayerStore.getState().setCurrentTrack(newTrack);
        usePlayerStore.getState().setIsArtworkLoaded(false); // Reset artwork loaded state
        
        // Try to get cached color first
        if (track.id && track.artwork) {
          const cachedColor = await ColorCacheService.getStoredColor(track.id);
          if (cachedColor) {
            usePlayerStore.getState().setArtworkColor(cachedColor);
            usePlayerStore.getState().setIsArtworkLoaded(true);
          } else {
            // If no cached color, let the useImageColor hook handle it
            usePlayerStore.getState().setArtworkColor('');
          }
        }
      }
    } else {
      usePlayerStore.getState().setCurrentTrack(null);
      usePlayerStore.getState().setArtworkColor('');
      usePlayerStore.getState().setIsArtworkLoaded(false);
    }
  });

  // Playback state events
  TrackPlayer.addEventListener(Event.PlaybackState, (event) => {
    usePlayerStore.getState().setIsPlaying(event.state === State.Playing);
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