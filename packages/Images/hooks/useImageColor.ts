import { useCallback, useState, useRef } from 'react';
import { useTheme } from '@/theme';
import { ensureColorContrast } from '../utils/utils';
import { Image as RNImage } from 'react-native';
import { getColors } from 'react-native-image-colors';

export function useImageColor(imageUrl?: any) {
  const { theme } = useTheme();
  const [backgroundColor, setBackgroundColor] = useState(theme.colors.accent);
  const [isLoading, setIsLoading] = useState(false);
  const lastProcessedUrl = useRef<string>();

  const generateCacheKey = (uri: string): string => {
    // Create a shorter unique key from the last part of the URI
    const parts = uri.split('/');
    const fileName = parts[parts.length - 1];
    return `img_${fileName.replace(/[^a-zA-Z0-9]/g, '')}`; // Remove special characters
  };

  const extractColor = async (uri: string) => {
    try {
      const cacheKey = generateCacheKey(uri);
      const colors = await getColors(uri, {
        fallback: theme.colors.accent,
        cache: true,
        key: cacheKey,
        quality: 'low',
      });

      let dominantColor = theme.colors.accent;
      if (colors.platform === 'android') {
        dominantColor = colors.dominant;
      } else if (colors.platform === 'ios') {
        dominantColor = colors.background;
      }

      return dominantColor + 'EE';
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
  }, [imageUrl, theme.colors.accent]);

  return {
    backgroundColor,
    onLoad,
    isLoading
  };
}