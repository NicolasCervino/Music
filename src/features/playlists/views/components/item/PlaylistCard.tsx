import { Playlist } from '@/entities';
import { useTheme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface PlaylistCardProps {
   playlist: Playlist;
   onPress: () => void;
}

export function PlaylistCard({ playlist, onPress }: PlaylistCardProps): React.ReactElement {
   const { theme } = useTheme();

   // Format track count
   const trackCount = playlist.trackIds.length;
   const trackText = trackCount === 1 ? '1 track' : `${trackCount} tracks`;

   return (
      <Pressable onPress={onPress} style={styles.container}>
         <View style={styles.coverContainer}>
            {playlist.coverArt ? (
               <Image source={{ uri: playlist.coverArt }} style={styles.cover} />
            ) : (
               <View
                  style={[styles.placeholderCover, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}
               >
                  <Ionicons name="musical-note" size={24} color={theme.colors.text} />
               </View>
            )}
            {trackCount > 0 && (
               <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                  <Ionicons name="play-circle" size={36} color="white" />
               </View>
            )}
         </View>
         <View style={styles.details}>
            <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
               {playlist.name}
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.text + '80' }]}>{trackText}</Text>
         </View>
      </Pressable>
   );
}

const styles = StyleSheet.create({
   container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
      paddingVertical: 8,
   },
   coverContainer: {
      width: 56,
      height: 56,
      borderRadius: 8,
      overflow: 'hidden',
      position: 'relative',
   },
   cover: {
      width: '100%',
      height: '100%',
   },
   placeholderCover: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
   },
   overlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
   },
   details: {
      flex: 1,
      marginLeft: 12,
      justifyContent: 'center',
   },
   title: {
      fontSize: 16,
      fontWeight: 'bold',
   },
   subtitle: {
      fontSize: 14,
      marginTop: 2,
   },
});
