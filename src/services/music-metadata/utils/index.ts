import { EXCLUDED_PATTERNS, WHATSAPP_AUDIO_PATTERN } from '../constants';

const stableHash = (str: string): string => {
   const normalizedStr = str.toLowerCase().trim();
   let hash = 0;

   if (normalizedStr.length === 0) return hash.toString(36);

   for (let i = 0; i < normalizedStr.length; i++) {
      const char = normalizedStr.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
   }

   return Math.abs(hash).toString(36);
};

const generateTrackId = (url: string): string => {
   const cleanUrl = url.replace('/storage/emulated/0/', '').split('?')[0];
   return `track-${stableHash(cleanUrl)}`;
};

// Check if track should be excluded based on URL
const shouldExcludeTrack = (url: string): boolean => {
   const lowerUrl = url.toLowerCase();

   return (
      EXCLUDED_PATTERNS.some(pattern => lowerUrl.includes(pattern)) ||
      WHATSAPP_AUDIO_PATTERN.test(lowerUrl)
   );
};

const formatDuration = (durationMs: number): string => {
   const totalSeconds = Math.floor(durationMs / 1000);
   const minutes = Math.floor(totalSeconds / 60);
   const seconds = totalSeconds % 60;
   return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const musicMetadataUtils = {
   stableHash,
   generateTrackId,
   shouldExcludeTrack,
   formatDuration,
};
