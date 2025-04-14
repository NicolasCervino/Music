import { usePlayer } from '@/modules/player/hooks/usePlayer';
import { TrackBanner } from '@/packages/Songs/components/TrackBanner';
import { Track } from '@/src/entities';
import { useTheme } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { Pressable, View } from 'react-native';

interface SelectableSongProps {
   onPress: () => void;
   isSelected: boolean;
   track: Track;
}

const SelectableSongComponent = ({
   onPress,
   isSelected,
   track,
}: SelectableSongProps): React.ReactElement => {
   const { theme } = useTheme();
   const { artworkColor } = usePlayer();

   const accentColor = artworkColor === '' ? theme.colors.primary : artworkColor;

   return (
      <Pressable onPress={onPress} style={{ marginVertical: 2 }}>
         <View
            style={{
               flexDirection: 'row',
               alignItems: 'center',
               justifyContent: 'space-between',
               paddingRight: 16,
            }}
         >
            <View style={{ flex: 1, marginRight: -16 }}>
               <TrackBanner track={track} isActive={false} onPress={onPress} />
            </View>
            <View
               style={{
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 8,
               }}
            >
               {isSelected ? (
                  <Ionicons name="checkmark-circle" size={24} color={accentColor} />
               ) : (
                  <View
                     style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        borderWidth: 2,
                        borderColor: theme.colors.text + '40',
                     }}
                  />
               )}
            </View>
         </View>
      </Pressable>
   );
};

export const SelectableSong = memo(SelectableSongComponent);
