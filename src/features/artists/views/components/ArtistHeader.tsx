import { Text } from '@/components/atoms';
import { Artist, Track } from '@/src/entities';
import { usePlayer } from '@/src/features/player';
import { useTheme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, View } from 'react-native';

interface ArtistHeaderProps {
   artist: Artist | null;
   onPlayAll?: (songs: Track[]) => void;
   onShufflePlay?: () => void;
   songCount: number;
   songs: Track[];
}

export function ArtistHeader({
   artist,
   onPlayAll,
   onShufflePlay,
   songCount,
   songs,
}: ArtistHeaderProps) {
   const { theme } = useTheme();
   const { artworkColor } = usePlayer();

   const buttonColor = artworkColor === '' ? theme.colors.primary : artworkColor;

   if (!artist) return null;

   const handlePlayAll = () => {
      if (onPlayAll && songs.length > 0) {
         onPlayAll(songs);
      }
   };

   return (
      <View style={styles.container}>
         <View style={styles.imageContainer}>
            <Image
               source={{ uri: artist.image || 'https://via.placeholder.com/150' }}
               style={styles.artistImage}
            />
         </View>

         <View style={styles.infoContainer}>
            <Text variant="heading" style={styles.artistName}>
               {artist.name}
            </Text>

            {artist.genres && artist.genres.length > 0 && (
               <View style={styles.genresContainer}>
                  {artist.genres.map((genre, index) => (
                     <View
                        key={index}
                        style={[styles.genreTag, { backgroundColor: theme.colors.card }]}
                     >
                        <Text style={{ color: theme.colors.text, opacity: 0.6, fontSize: 12 }}>
                           {genre}
                        </Text>
                     </View>
                  ))}
               </View>
            )}

            <Text style={{ color: theme.colors.text, opacity: 0.6, marginVertical: 8 }}>
               {songCount} songs
            </Text>

            <View style={styles.actionContainer}>
               <Pressable
                  style={[styles.playButton, { backgroundColor: buttonColor }]}
                  onPress={handlePlayAll}
                  disabled={songs.length === 0}
               >
                  <Ionicons name="play" size={20} color="white" />
                  <Text style={{ color: 'white', marginLeft: 8 }}>Play All</Text>
               </Pressable>
               <Pressable
                  style={styles.iconButton}
                  onPress={onShufflePlay}
                  disabled={songs.length === 0}
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
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      paddingVertical: 24,
      paddingHorizontal: 16,
   },
   imageContainer: {
      alignItems: 'center',
      marginBottom: 16,
   },
   artistImage: {
      width: 150,
      height: 150,
      borderRadius: 75,
   },
   infoContainer: {
      alignItems: 'center',
   },
   artistName: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 8,
   },
   genresContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 8,
      marginTop: 8,
   },
   genreTag: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 16,
   },
   actionContainer: {
      flexDirection: 'row',
      marginTop: 16,
      alignItems: 'center',
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
