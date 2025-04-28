import { MusicService } from '@/services';
import { PlayerService } from '@/services/TrackPlayerService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useInitializePlayer() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async () => {
         await PlayerService.setupPlayer();
      },
      onSuccess: () => {
         queryClient.prefetchInfiniteQuery({
            queryKey: ['tracks'],
            queryFn: ({ pageParam = 0 }) => MusicService.getAllTracks(pageParam),
            initialPageParam: 0,
            staleTime: 1000 * 60 * 5,
         });
      },
   });
}
