import { Text } from '@/components/atoms';
import { Image } from 'expo-image';
import { Pressable, StyleSheet } from 'react-native';
import { Artist } from '../../../types';

const styles = StyleSheet.create({
   popularArtistCard: {
      width: 150,
      alignItems: 'center',
   },
   popularArtistImage: {
      width: 150,
      height: 150,
      borderRadius: 75,
      marginBottom: 12,
   },
   artistInfo: {
      flex: 1,
   },
   artistName: {
      marginBottom: 4,
   },
   followers: {
      opacity: 0.7,
      marginBottom: 8,
   },
});

export function PopularArtistCard({ artist }: { artist: Artist }) {
   return (
      <Pressable key={artist.id} style={styles.popularArtistCard}>
         <Image
            source={{ uri: artist.image }}
            style={styles.popularArtistImage}
            contentFit="cover"
         />
         <Text variant="subtitle" style={styles.artistName}>
            {artist.name}
         </Text>
         <Text variant="caption" style={styles.followers}>
            {artist.followers} followers
         </Text>
      </Pressable>
   );
}
