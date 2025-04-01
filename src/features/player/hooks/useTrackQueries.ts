import { ColorService } from '@/services/CacheColorService';
import { MusicService } from '@/services/MusicMetadataService';
import { PlayerService } from '@/services/TrackPlayerService';
import { useTheme } from '@/theme';
import { ensureColorContrast } from '@/utils';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Image as RNImage } from 'react-native';
import { getColors } from 'react-native-image-colors';

// Fetch tracks with infinite pagination
export function useTracks() {
  const STALE_TIME = 1000 * 60 * 5; // 5 minutes

  return useInfiniteQuery({
    queryKey: ['tracks'],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await MusicService.getAllTracks(pageParam);
      return result;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) return undefined;
      return allPages.length; // This will be the next page number
    },
    initialPageParam: 0,
    staleTime: STALE_TIME,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

// Get current track
export function useCurrentTrack() {
  return useQuery({
    queryKey: ['currentTrack'],
    queryFn: async () => {
      await PlayerService.setupPlayer();
      return PlayerService.getCurrentTrack();
    },
    staleTime: Infinity, // Never consider stale by time passing
    gcTime: Infinity, // Never remove from cache
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

// Extract artwork color using hook
export function useTrackColor(trackId?: string, artwork?: string) {
  const { theme } = useTheme();

  return useQuery({
    queryKey: ['trackColor', trackId],
    queryFn: async () => {
      if (!trackId || !artwork) return theme.colors.primary;
      
      // Try to get from cache first
      const cachedColor = await ColorService.getStoredColor(trackId);
      if (cachedColor) return ensureColorContrast(cachedColor);
      
      // Extract color
      try {
        const uri = typeof artwork === 'string'
          ? artwork
          : RNImage.resolveAssetSource(artwork).uri;
          
        const colors = await getColors(uri, {
          fallback: theme.colors.accent,
          cache: false,
          quality: 'low',
        });
        
        let dominantColor = theme.colors.accent;
        if (colors.platform === 'android') {
          dominantColor = colors.dominant;
        } else if (colors.platform === 'ios') {
          dominantColor = colors.background;
        }
        
        const finalColor = dominantColor + 'EE';
        
        // Store in cache
        await ColorService.storeColor(trackId, finalColor);
        
        return ensureColorContrast(finalColor);
      } catch (error) {
        console.error('Error extracting color:', error);
        return theme.colors.accent;
      }
    },
    enabled: !!trackId,
    staleTime: Infinity, // Colors don't change
  });
} 