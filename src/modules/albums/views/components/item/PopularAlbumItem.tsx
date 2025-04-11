import { Album } from '@/src/entities';
import { useTheme } from '@/theme';
import { Image } from 'expo-image';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface PopularAlbumItemProps {
   album: Album;
   onPress: () => void;
}

export const PopularAlbumItem = memo(({ album, onPress }: PopularAlbumItemProps) => {
   const { theme } = useTheme();

   return (
      <Pressable
         style={[styles.container, { backgroundColor: theme.colors.card }]}
         onPress={onPress}
      >
         <Image
            source={{ uri: album.artwork }}
            style={[styles.artwork, { backgroundColor: theme.colors.card }]}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={200}
         />
         <View style={styles.info}>
            <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
               {album.title}
            </Text>
            <Text
               style={[styles.artist, { color: theme.colors.text, opacity: 0.7 }]}
               numberOfLines={1}
            >
               {album.artist}
            </Text>
         </View>
      </Pressable>
   );
});

const styles = StyleSheet.create({
   container: {
      width: 150,
      marginRight: 16,
      borderRadius: 8,
      overflow: 'hidden',
   },
   artwork: {
      width: 150,
      height: 150,
      borderRadius: 8,
   },
   info: {
      marginTop: 8,
      padding: 8,
   },
   title: {
      fontSize: 14,
      fontWeight: '600',
   },
   artist: {
      fontSize: 12,
      marginTop: 2,
   },
});
