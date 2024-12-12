import { View, FlatList } from 'react-native';
import { Text, SeeAll } from '@/components/atoms';
import { StyleSheet } from 'react-native';
import { usePlayerStore } from '@/store/usePlayerStore';
import { TrackBanner } from './components/TrackBanner';
import { Track } from '@/entities';
import { PLAYER_BAR_HEIGHT } from '@/constants/dimensions';

export function SongList({ ListHeaderComponent }: { ListHeaderComponent?: React.ComponentType<any> }) {
  const { songs, playTrack, currentTrack, loadMoreSongs, isLoadingMore, hasMore, isVisible } = usePlayerStore();
  const listPadding = isVisible ? PLAYER_BAR_HEIGHT + 16 : 0;

  const renderItem = ({ item: track }: { item: Track }) => (
    <TrackBanner
      track={track}
      isActive={currentTrack?.id === track.id}
      onPress={() => {
        if (currentTrack?.id !== track.id) {
          playTrack(track);
        }
      }}
    />
  );

  const renderFooter = () => {
    if (isLoadingMore) {
      return (
        <View style={styles.footer}>
          <Text>Loading more songs...</Text>
        </View>
      );
    }
    if (!hasMore && songs.length > 0) {
      return (
        <View style={styles.footer}>
          <Text>No more songs</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, { paddingBottom: listPadding }]}>
      <FlatList
        ListHeaderComponent={
          <View style={styles.listContent}>
            {ListHeaderComponent && <ListHeaderComponent />}
            <View style={styles.sectionHeader}>
              <Text variant="heading">Song List</Text>
              <SeeAll />
            </View>
          </View>
        }
        ListHeaderComponentStyle={styles.listContent}
        data={songs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={loadMoreSongs}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  listContent: {
    paddingHorizontal: 10,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
});