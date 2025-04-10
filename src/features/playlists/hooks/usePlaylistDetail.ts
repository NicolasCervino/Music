import { Track } from '@/entities';
import { useCurrentTrack, usePlayerControls } from '@/features/player';
import { usePlaylist, usePlaylistTracks } from './usePlaylists';

export function usePlaylistDetail(playlistId: string) {
   const { data: playlist, isLoading: isPlaylistLoading } = usePlaylist(playlistId);
   const { data: tracks, isLoading: isTracksLoading, isError } = usePlaylistTracks(playlistId);

   // Player controls
   const { data: currentTrack } = useCurrentTrack();
   const controls = usePlayerControls();

   const isPlayerVisible = !!currentTrack;
   const activeTrackId = currentTrack?.id;

   const onPlayTrack = (track: Track) => {
      if (tracks && tracks.length > 0) {
         controls.playTrack({
            track,
            allTracks: tracks,
         });
      }
   };

   const onShufflePlay = () => {
      if (tracks && tracks.length > 0) {
         controls.shufflePlay({
            tracks: tracks,
         });
      }
   };

   return {
      playlist,
      data: { tracks: tracks || [] },
      isLoading: isPlaylistLoading || isTracksLoading,
      isError,
      // Player controls
      activeTrackId,
      isPlayerVisible,
      onPlayTrack,
      onShufflePlay,
      pagination: {
         onLoadMore: () => {},
         hasMore: false,
         isFetching: false,
      },
   };
}
