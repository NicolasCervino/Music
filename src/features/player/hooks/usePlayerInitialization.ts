import { MusicService } from '@/services/MusicMetadataService';
import { PlayerService } from '@/services/TrackPlayerService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useInitializePlayer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      await PlayerService.setupPlayer();
    },
    onSuccess: () => {
      // Prefetch the first page of tracks
      queryClient.prefetchInfiniteQuery({
        queryKey: ['tracks'],
        queryFn: ({ pageParam = 0 }) => MusicService.getAllTracks(pageParam),
        initialPageParam: 0
      });
    }
  });
} 