import { useTrackColor } from '@/features/player';
import { useTheme } from '@/theme';
import { useCallback } from 'react';

export function useImageColor(imageUrl?: any, trackId?: string) {
  const { theme } = useTheme();
  const { data: backgroundColor, isLoading } = useTrackColor(trackId, imageUrl);
  
  const onLoad = useCallback(async () => {
    // This is now a no-op since loading is handled by the query
    // Kept for API compatibility
  }, []);

  return {
    backgroundColor: backgroundColor || theme.colors.accent,
    onLoad,
    isLoading
  };
}