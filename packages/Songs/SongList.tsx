import { View } from 'react-native';
import { Text, SeeAll } from '@/components/atoms';
import { StyleSheet } from 'react-native';
import { usePlayerStore } from '@/store/usePlayerStore';
import { TrackBanner } from './components/TrackBanner';

export function SongList() {
  const { songs, playTrack, currentTrack } = usePlayerStore();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="heading">Song List</Text>
        <SeeAll />
      </View>
      {songs.map((track) => (
        <TrackBanner
          key={track.id}
          track={track}
          isActive={currentTrack?.id === track.id}
          onPress={() => {
            if (currentTrack?.id !== track.id) {
              playTrack(track);
            }
          }}
        />
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
}); 