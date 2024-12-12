import { ColorCacheService } from '@/services/CacheColorService';
import { useTheme } from '@/theme';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Image as RNImage } from 'react-native';
import { getColors } from 'react-native-image-colors';
import { ensureColorContrast } from '../utils/utils';

export function useImageColor(imageUrl?: any, trackId?: string) {
  const { theme } = useTheme();
  const [backgroundColor, setBackgroundColor] = useState(theme.colors.accent);
  const [isLoading, setIsLoading] = useState(false);
  const lastProcessedUrl = useRef<string>();

 const extractColor = async (uri: string) => {
    try {
      // First, check if we have a cached color for this track
      if (trackId) {
        const cachedColor = await ColorCacheService.getStoredColor(trackId);
        if (cachedColor) {
          return cachedColor;
        }
      }

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

      // Store the extracted color in cache
      if (trackId) {
        await ColorCacheService.storeColor(trackId, finalColor);
      }

      return finalColor;
    } catch (error) {
      console.error('Error extracting color:', error);
      return theme.colors.accent;
    }
  };

  const onLoad = useCallback(async () => {
    if (!imageUrl) {
      setBackgroundColor(theme.colors.accent);
      return;
    }

    const uri = typeof imageUrl === 'string'
      ? imageUrl
      : RNImage.resolveAssetSource(imageUrl).uri;

    if (lastProcessedUrl.current === uri) {
      return;
    }

    setIsLoading(true);
    try {
      lastProcessedUrl.current = uri;
      const dominantColor = await extractColor(uri);
      const adjustedColor = ensureColorContrast(dominantColor);
      setBackgroundColor(adjustedColor);
    } catch (error) {
      console.error('Error in onLoad:', error);
      setBackgroundColor(theme.colors.accent);
    } finally {
      setIsLoading(false);
    }
  }, [imageUrl, trackId, theme.colors.accent]);

   useEffect(() => {
    if (trackId) {
      ColorCacheService.getStoredColor(trackId).then(cachedColor => {
        if (cachedColor) {
          setBackgroundColor(ensureColorContrast(cachedColor));
        }
      });
    }
  }, [trackId]);

  return {
    backgroundColor,
    onLoad,
    isLoading
  };
}