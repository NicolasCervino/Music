import { Track } from '@/entities';
import { useCurrentTrack, usePlayerControls } from '@/modules/player';
import { usePlaylists } from './usePlaylists';

export function usePlaylistDetail(playlistId: string) {
   const { getById, getTracks, removeTrack } = usePlaylists();
   const { data: playlist, isLoading: isPlaylistLoading } = getById(playlistId);
   const { data: tracks, isLoading: isTracksLoading, isError } = getTracks(playlistId);

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

   const removeTrackFromPlaylist = (trackId: string) => {
      if (playlist) {
         removeTrack.mutate({ playlistId: playlist.id, trackId });
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
      removeTrackFromPlaylist,
      pagination: {
         onLoadMore: () => {},
         hasMore: false,
         isFetching: false,
      },
   };
}
