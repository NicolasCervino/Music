import { Text } from '@/components/atoms';
import { Album, Track } from '@/src/entities';
import { usePlayer } from '@/src/modules/player';
import { useTheme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

interface AlbumHeaderProps {
   album: Album | null;
   trackCount: number;
   tracks: Track[];
   onPlayAll: (tracks: Track[]) => void;
   onShufflePlay: () => void;
}

export function AlbumHeader({
   album,
   trackCount,
   tracks,
   onPlayAll,
   onShufflePlay,
}: AlbumHeaderProps) {
   const { theme } = useTheme();
   const { artworkColor } = usePlayer();

   const buttonColor = artworkColor === '' ? theme.colors.primary : artworkColor;

   if (!album) {
      return null;
   }

   const handlePlayAll = () => {
      if (tracks.length > 0) {
         onPlayAll(tracks);
      }
   };

   return (
      <View style={styles.container}>
         <View style={styles.albumInfo}>
            <Image
               source={{ uri: album.artwork }}
               style={[styles.artwork, { backgroundColor: theme.colors.card }]}
               contentFit="cover"
               cachePolicy="memory-disk"
               transition={200}
            />
            <View style={styles.info}>
               <Text style={[styles.title, { color: theme.colors.text }]}>{album.title}</Text>
               <Text style={[styles.artist, { color: theme.colors.text, opacity: 0.7 }]}>
                  {album.artist}
               </Text>
               {/*   <Text style={[styles.details, { color: theme.colors.text, opacity: 0.5 }]}>
                  {album.year} • {trackCount} tracks
               </Text> */}
            </View>
         </View>

         <View style={styles.actionsContainer}>
            <Pressable
               style={[styles.playButton, { backgroundColor: buttonColor }]}
               onPress={handlePlayAll}
               disabled={tracks.length === 0}
            >
               <Ionicons name="play" size={20} color="white" />
               <Text style={{ color: 'white', marginLeft: 8 }}>Play All</Text>
            </Pressable>

            <Pressable
               style={styles.iconButton}
               onPress={onShufflePlay}
               disabled={tracks.length === 0}
            >
               <Ionicons
                  name="shuffle"
                  size={24}
                  color={theme.colors.text}
                  style={{ opacity: 0.6 }}
               />
            </Pressable>
         </View>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      padding: 16,
   },
   albumInfo: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   artwork: {
      width: 120,
      height: 120,
      borderRadius: 8,
   },
   info: {
      marginLeft: 16,
      flex: 1,
   },
   title: {
      fontSize: 22,
      fontWeight: '700',
   },
   artist: {
      fontSize: 16,
      marginTop: 4,
   },
   details: {
      fontSize: 14,
      marginTop: 4,
   },
   actionsContainer: {
      marginTop: 24,
      flexDirection: 'row',
      justifyContent: 'flex-start',
   },
   playButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 16,
   },
   iconButton: {
      padding: 8,
   },
});
