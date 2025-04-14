import { Text } from '@/components/atoms';
import { Playlist, Track } from '@/src/entities';
import { usePlayer } from '@/src/modules/player';
import { useTheme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

interface PlaylistDetailHeaderProps {
   playlist: Playlist | null;
   trackCount: number;
   tracks: Track[];
   onPlayAll: (tracks: Track[]) => void;
   onShufflePlay: () => void;
}

export function PlaylistDetailHeader({
   playlist,
   trackCount,
   tracks,
   onPlayAll,
   onShufflePlay,
}: PlaylistDetailHeaderProps) {
   const { theme } = useTheme();
   const { artworkColor } = usePlayer();

   const buttonColor = artworkColor === '' ? theme.colors.primary : artworkColor;

   if (!playlist) {
      return null;
   }

   const handlePlayAll = () => {
      if (tracks.length > 0) {
         onPlayAll(tracks);
      }
   };

   return (
      <View style={styles.container}>
         <View style={styles.playlistInfo}>
            {playlist.coverArt ? (
               <Image
                  source={{ uri: playlist.coverArt }}
                  style={[styles.artwork, { backgroundColor: theme.colors.card }]}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                  transition={200}
               />
            ) : (
               <View
                  style={[
                     styles.artwork,
                     {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        justifyContent: 'center',
                        alignItems: 'center',
                     },
                  ]}
               >
                  <Ionicons name="musical-note" size={50} color={theme.colors.text} />
               </View>
            )}
            <View style={styles.info}>
               <Text style={[styles.title, { color: theme.colors.text }]}>
                  {playlist.name || 'Unknown Playlist'}
               </Text>
               <Text style={[styles.details, { color: theme.colors.text, opacity: 0.5 }]}>
                  {trackCount} {trackCount === 1 ? 'track' : 'tracks'}
               </Text>
               {playlist.description && (
                  <Text
                     style={[styles.description, { color: theme.colors.text, opacity: 0.7 }]}
                     numberOfLines={2}
                  >
                     {playlist.description}
                  </Text>
               )}
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
   playlistInfo: {
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
   description: {
      fontSize: 14,
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
