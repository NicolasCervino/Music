import { Track } from '@/entities';
import { useCurrentTrack, usePlayerControls, useTracks } from '@/features/player';
import { useMemo } from 'react';

export const useSongList = () => {
   const { data: currentTrack } = useCurrentTrack();
   const {
      data: tracksData,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      isLoading,
      isError,
   } = useTracks();
   const controls = usePlayerControls();

   const activeTrackId = currentTrack?.id;

   const songs = useMemo(() => {
      if (!tracksData?.pages) return [];

      const uniqueSongs = new Map<string, Track>();
      tracksData.pages.forEach(page => {
         page.tracks.forEach(track => {
            if (!uniqueSongs.has(track.id)) {
               uniqueSongs.set(track.id, track);
            }
         });
      });

      return Array.from(uniqueSongs.values());
   }, [tracksData?.pages]);

   const handlePlayTrack = (track: Track) => {
      if (track.id !== activeTrackId) {
         controls.playTrack({ track, allTracks: songs });
      }
   };

   const handleEndReached = () => {
      if (hasNextPage && !isFetchingNextPage) {
         fetchNextPage().catch(error => {
            console.error('Error fetching next page:', error);
         });
      }
   };

   return {
      songs,
      currentTrack,
      activeTrackId,
      isLoading,
      isError,
      isFetchingNextPage,
      hasNextPage,
      handlePlayTrack,
      handleEndReached,
   };
};
