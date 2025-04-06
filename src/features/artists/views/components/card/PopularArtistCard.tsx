import { Text } from '@/components/atoms';
import { Image } from 'expo-image';
import { Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { Artist } from '../../../types';

const styles = StyleSheet.create({
   popularArtistCard: {
      width: 150,
      alignItems: 'center',
      marginRight: 16,
   },
   popularArtistImage: {
      width: 150,
      height: 150,
      borderRadius: 75,
      marginBottom: 8,
   },
   artistInfo: {
      flex: 1,
   },
   artistName: {
      marginBottom: 4,
   },
});

export function PopularArtistCard({ artist }: { artist: Artist }) {
   const router = useRouter();

   return (
      <Pressable
         key={artist.id}
         style={styles.popularArtistCard}
         onPress={() => router.push(`/artist/${artist.id}` as unknown as Href)}
      >
         <Image
            source={{ uri: artist.image }}
            style={styles.popularArtistImage}
            contentFit="cover"
         />
         <Text variant="subtitle" style={styles.artistName}>
            {artist.name}
         </Text>
      </Pressable>
   );
}
