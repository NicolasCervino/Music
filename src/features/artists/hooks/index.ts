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
