import { PlayerService } from '@/services/TrackPlayerService';
import { useQuery } from '@tanstack/react-query';

// Get current track
export function useCurrentTrack() {
  return useQuery({
    queryKey: ['currentTrack'],
    queryFn: async () => {
      await PlayerService.setupPlayer();
      return PlayerService.getCurrentTrack();
    },
    staleTime: 500, // Consider stale after 500ms to allow for more frequent updates
    gcTime: Infinity, // Never remove from cache
    refetchOnMount: true, // Refetch on mount to ensure we have the latest data
    refetchOnWindowFocus: true, // Refetch when window gets focus
    refetchOnReconnect: true, // Refetch on reconnect
  });
} 