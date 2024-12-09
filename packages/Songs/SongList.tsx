import { View, Pressable } from 'react-native';
import { Text, SeeAll } from '@/components/atoms';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import { SAMPLE_SONGS } from './sample';

export function SongList() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="heading">Song List</Text>
        <SeeAll />
      </View>

      {SAMPLE_SONGS.map((song) => (
        <Pressable
          key={song.id}
          style={styles.songItem}
        >
          <Image
            source={{ uri: song.artwork }}
            style={styles.artwork}
            contentFit="cover"
          />
          <View style={styles.songInfo}>
            <Text variant="subtitle" style={styles.title}>{song.title}</Text>
            <Text variant="caption" style={styles.artist}>{song.artist}</Text>
          </View>
          <Text variant="caption" style={styles.duration}>{song.duration}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  artwork: {
    width: 56,
    height: 56,
    borderRadius: 4,
  },
  songInfo: {
    flex: 1,
  },
  title: {
    marginBottom: 4,
  },
  artist: {
    opacity: 0.7,
  },
  duration: {
    opacity: 0.7,
  },
}); 