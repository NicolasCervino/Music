import { Text } from '@/components/atoms';
import { usePlayer } from '@/src/features/player';
import { useTheme } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

interface PlaylistHeaderProps {
   onPress: () => void;
}

export const PlaylistHeader = ({ onPress }: PlaylistHeaderProps) => {
   const { theme } = useTheme();
   const { artworkColor } = usePlayer();
   const backgroundColor = artworkColor === '' ? theme.colors.primary : artworkColor;

   return (
      <View style={styles.header}>
         <Text variant="heading" style={{ color: theme.colors.text }}>
            Your Playlists
         </Text>
         <Pressable style={[styles.createButton, { backgroundColor }]} onPress={onPress}>
            <Ionicons name="add" size={22} color="white" />
            <Text style={{ color: 'white', marginLeft: 4, fontWeight: 'bold' }}>New Playlist</Text>
         </Pressable>
      </View>
   );
};

const styles = StyleSheet.create({
   header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 16,
   },
   createButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
   },
});
