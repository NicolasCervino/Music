import { Track } from '@/src/entities';
import { useCurrentTrack, usePlayerControls } from '@/src/features/player';
import { useQuery } from '@tanstack/react-query';
import { fetchArtists } from '../fetch';

export const STALE_TIME = 1000 * 60 * 5; // 5 minutes

export function useArtists() {
   return useQuery({
      queryKey: ['artists'],
      queryFn: () => fetchArtists.get(),
      staleTime: STALE_TIME,
   });
}

export function usePopularArtists(limit: number = 3) {
   return useQuery({
      queryKey: ['popularArtists', limit],
      queryFn: () => fetchArtists.getPopular(limit),
      staleTime: STALE_TIME,
   });
}

export function useArtistSongs(artistId: string) {
   const { data: artist, isLoading: isArtistLoading } = useQuery({
      queryKey: ['artist', artistId],
      queryFn: () => fetchArtists.getById(artistId),
      enabled: !!artistId,
      staleTime: STALE_TIME,
   });

   const {
      data: songs,
      isLoading: isSongsLoading,
      isError,
   } = useQuery({
      queryKey: ['artist-songs', artistId],
      queryFn: () => fetchArtists.getSongs(artistId),
      enabled: !!artistId,
      staleTime: STALE_TIME,
   });

   // Player controls
   const { data: currentTrack } = useCurrentTrack();
   const controls = usePlayerControls();

   const isPlayerVisible = !!currentTrack;
   const activeTrackId = currentTrack?.id;

   const onPlayTrack = (track: Track) => {
      controls.playTrack({
         track,
         allTracks: songs || [],
      });
   };

   return {
      artist,
      data: { songs: songs || [] },
      isLoading: isArtistLoading || isSongsLoading,
      isError,
      // Player controls
      activeTrackId,
      isPlayerVisible,
      onPlayTrack,
      pagination: {
         onLoadMore: () => {},
         hasMore: false,
         isFetching: false,
      },
   };
}
