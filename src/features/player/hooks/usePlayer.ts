import { usePlayerControls } from './usePlayerControls';
import { usePlayerExpansion, usePlayerState } from './usePlayerState';
import { useCurrentTrack, useTrackColor } from './useTrackQueries';

export function usePlayer() {
   const {
      isExpanded: { data: isExpanded },
      setIsExpanded,
   } = usePlayerExpansion();
   const { data: currentTrack } = useCurrentTrack();
   const { data: playerState } = usePlayerState();
   const { data: backgroundColor, isLoading: isColorLoading } = useTrackColor(
      currentTrack?.id,
      currentTrack?.artwork
   );
   const controls = usePlayerControls();

   const isVisible = !!currentTrack;
   const isPlayerReady = !!currentTrack && !isColorLoading && !!backgroundColor;

   return {
      currentTrack,
      isPlaying: playerState?.isPlaying || false,
      artworkColor: backgroundColor || '',
      isArtworkLoaded: !isColorLoading,
      isPlayerReady,
      isExpanded: isExpanded || false,
      isVisible,
      setIsExpanded,
      playTrack: controls.playTrack,
      pauseTrack: () => controls.playPause({ isPlaying: true }),
      resumeTrack: () => controls.playPause({ isPlaying: false }),
      nextTrack: controls.nextTrack,
      previousTrack: controls.previousTrack,
      repeatMode: playerState?.repeatMode || 0,
      toggleRepeatMode: controls.toggleRepeatMode,
   };
}
