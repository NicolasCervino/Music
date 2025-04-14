import { Track } from '@/entities';
import { useCurrentTrack, usePlayerControls, useTracks } from '@/modules/player';
import { useCallback, useMemo } from 'react';

export interface SongListHookResult {
   songs: Track[];
   activeTrackId: string | undefined;
   isPlayerVisible: boolean;
   isLoading: boolean;
   isError: boolean;
   pagination: {
      isFetching: boolean;
      hasMore: boolean | undefined;
      onLoadMore: () => void;
   };
   onPlayTrack: (track: Track) => void;
   onShufflePlay?: () => void;
}

export const useSongList = (): SongListHookResult => {
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
   const isPlayerVisible = !!currentTrack;

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

   const onPlayTrack = (track: Track) => {
      if (track.id !== activeTrackId) {
         controls.playTrack({ track, allTracks: songs });
      }
   };

   const onLoadMore = () => {
      if (hasNextPage && !isFetchingNextPage) {
         fetchNextPage().catch(error => {
            console.error('Error fetching next page:', error);
         });
      }
   };

   const onShufflePlay = useCallback(() => {
      if (songs.length === 0) return;
      const shuffledSongs = [...songs].sort(() => Math.random() - 0.5);
      controls.playTrack({
         track: shuffledSongs[0],
         allTracks: shuffledSongs,
      });
   }, [songs, controls]);

   return {
      songs,
      activeTrackId,
      isPlayerVisible,
      isLoading,
      isError,
      pagination: {
         isFetching: isFetchingNextPage,
         hasMore: hasNextPage,
         onLoadMore,
      },
      onPlayTrack,
      onShufflePlay,
   };
};
