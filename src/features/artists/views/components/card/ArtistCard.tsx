import { Text } from '@/components/atoms';
import { Artist } from '@/src/entities';
import { useTheme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
   artistListItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      gap: 12,
   },
   artistListImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
   },
   artistInfo: {
      flex: 1,
   },
   artistName: {
      marginBottom: 4,
   },
   genreContainer: {
      flexDirection: 'row',
      gap: 8,
   },
   genreTag: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
   },
   genreText: {
      opacity: 0.8,
   },
});

interface ArtistCardProps {
   artist: Artist;
   onPress?: () => void;
}

export function ArtistCard({ artist, onPress }: ArtistCardProps) {
   const { theme } = useTheme();

   return (
      <Pressable key={artist.id} style={styles.artistListItem} onPress={onPress}>
         <Image source={{ uri: artist.image }} style={styles.artistListImage} contentFit="cover" />
         <View style={styles.artistInfo}>
            <Text variant="subtitle" style={styles.artistName}>
               {artist.name}
            </Text>
            <View style={styles.genreContainer}>
               {artist.genres.map((genre, index) => (
                  <View
                     key={index}
                     style={[styles.genreTag, { backgroundColor: theme.colors.card }]}
                  >
                     <Text variant="caption" style={styles.genreText}>
                        {genre}
                     </Text>
                  </View>
               ))}
            </View>
         </View>
         <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.colors.text}
            style={{ opacity: 0.6 }}
         />
      </Pressable>
   );
}
