import { Text } from '@/components/atoms';
import { ContextMenu, MenuOption } from '@/components/atoms/ContextMenu';
import { Track } from '@/entities';
import { usePlayer } from '@/src/modules/player';
import { useTheme } from '@/theme';
import { ensureColorContrast } from '@/utils/image';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { memo } from 'react';
import { TouchableOpacity, View } from 'react-native';

type TrackBannerProps = {
   track: Track;
   isActive: boolean;
   onPress: () => void;
   menuOptions?: MenuOption[];
};

export const TrackBanner = memo(function TrackBanner({
   track,
   isActive,
   onPress,
   menuOptions,
}: TrackBannerProps) {
   const { theme } = useTheme();
   const { artworkColor } = usePlayer();

   const backgroundColor = artworkColor === '' ? theme.colors.primary : artworkColor;
   const textColor = artworkColor === '' ? theme.colors.primary : ensureColorContrast(artworkColor);

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
                    borderLeftColor: backgroundColor,
                 }
               : null,
         ]}
         onPress={onPress}
         delayLongPress={300}
         onLongPress={() => {
            if (menuOptions && menuOptions.length > 0) {
               // This will open the context menu programmatically
               // The actual implementation depends on how ContextMenu works internally
               // This is handled by the ContextMenu component itself
            }
         }}
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
                  color={isActive ? textColor : theme.colors.text}
               />
            </View>
         )}
         <View style={{ flex: 1 }}>
            <Text
               variant="subtitle"
               style={[{ marginBottom: 4 }, isActive && { color: textColor }]}
               numberOfLines={1}
            >
               {track.title}
            </Text>
            <Text
               variant="caption"
               style={[{ opacity: 0.7 }, isActive && { color: textColor }]}
               numberOfLines={1}
            >
               {track.artist.name}
            </Text>
         </View>
         <Text
            variant="caption"
            style={[{ opacity: 0.7, marginRight: 8 }, isActive && { color: textColor }]}
            numberOfLines={1}
         >
            {track.duration}
         </Text>

         {menuOptions && menuOptions.length > 0 && (
            <ContextMenu options={menuOptions} accessibilityLabel={`Options for ${track.title}`} />
         )}
      </TouchableOpacity>
   );
});
