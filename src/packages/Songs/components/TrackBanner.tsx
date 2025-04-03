import { Text } from '@/components/atoms';
import { Track } from '@/entities';
import { useTheme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { memo } from 'react';
import { TouchableOpacity, View } from 'react-native';

type TrackBannerProps = {
   track: Track;
   isActive: boolean;
   onPress: () => void;
};

export const TrackBanner = memo(
   function TrackBanner({ track, isActive, onPress }: TrackBannerProps) {
      const { theme } = useTheme();

      return (
         <TouchableOpacity
            activeOpacity={0.5}
            style={[
               {
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  gap: 12,
               },
               isActive
                  ? {
                       backgroundColor: 'rgba(0, 0, 255, 0.15)',
                       borderLeftWidth: 3,
                       borderLeftColor: theme.colors.primary,
                    }
                  : null,
            ]}
            onPress={onPress}
         >
            {track.artwork ? (
               <Image
                  source={{ uri: track.artwork }}
                  style={{ width: 56, height: 56, borderRadius: 4 }}
                  contentFit="cover"
               />
            ) : (
               <View
                  style={{
                     backgroundColor: 'rgba(255, 255, 255, 0.1)',
                     justifyContent: 'center',
                     alignItems: 'center',
                     width: 56,
                     height: 56,
                     borderRadius: 4,
                  }}
               >
                  <Ionicons
                     name="musical-note"
                     size={24}
                     color={isActive ? theme.colors.primary : theme.colors.text}
                  />
               </View>
            )}
            <View style={{ flex: 1 }}>
               <Text
                  variant="subtitle"
                  style={[{ marginBottom: 4 }, isActive && { color: theme.colors.primary }]}
                  numberOfLines={1}
               >
                  {track.title}
               </Text>
               <Text
                  variant="caption"
                  style={[{ opacity: 0.7 }, isActive && { color: theme.colors.primary }]}
                  numberOfLines={1}
               >
                  {track.artist}
               </Text>
            </View>
            <Text
               variant="caption"
               style={[
                  { opacity: 0.7, marginRight: 8 },
                  isActive && { color: theme.colors.primary },
               ]}
               numberOfLines={1}
            >
               {track.duration}
            </Text>
         </TouchableOpacity>
      );
   },
   (prevProps, nextProps) => {
      // Simplify: only re-render if active state or track ID changes
      return prevProps.isActive === nextProps.isActive && prevProps.track.id === nextProps.track.id;
   }
);
