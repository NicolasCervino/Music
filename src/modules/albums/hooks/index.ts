import { Track } from '@/src/entities';
import { useCurrentTrack, usePlayerControls } from '@/src/modules/player';
import { useQuery } from '@tanstack/react-query';
import { fetchAlbums } from '../fetch';

const STALE_TIME = 1000 * 60 * 5; // 5 minutes

export function useAlbums() {
   return useQuery({
      queryKey: ['albums'],
      queryFn: () => fetchAlbums.get(),
      staleTime: STALE_TIME,
   });
}

export function usePopularAlbums(limit: number = 3) {
   return useQuery({
      queryKey: ['popularAlbums', limit],
      queryFn: () => fetchAlbums.getPopular(limit),
      staleTime: STALE_TIME,
   });
}

export function useAlbumTracks(albumId: string) {
   const { data: album, isLoading: isAlbumLoading } = useQuery({
      queryKey: ['album', albumId],
      queryFn: () => fetchAlbums.getById(albumId),
      enabled: !!albumId,
      staleTime: STALE_TIME,
   });

   const {
      data: tracks,
      isLoading: isTracksLoading,
      isError,
   } = useQuery({
      queryKey: ['album-tracks', albumId],
      queryFn: () => fetchAlbums.getTracks(albumId),
      enabled: !!albumId,
      staleTime: STALE_TIME,
   });

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
      album,
      data: { tracks: tracks || [] },
      isLoading: isAlbumLoading || isTracksLoading,
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
