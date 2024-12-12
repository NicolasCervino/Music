import { SeeAll, Text } from '@/components/atoms';
import { PLAYER_BAR_HEIGHT } from '@/constants/dimensions';
import { Track } from '@/entities';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { TrackBanner } from './components/TrackBanner';

const ITEM_HEIGHT = 76;

export function SongList({ ListHeaderComponent }: { ListHeaderComponent?: React.ComponentType<any> }) {
  const { songs, playTrack, currentTrack, loadMoreSongs, isLoadingMore, hasMore, isVisible } = usePlayerStore();
  const listPadding = isVisible ? PLAYER_BAR_HEIGHT + 16 : 0;

  const renderItem = useCallback(({ item: track }: { item: Track }) => (
    <TrackBanner
      track={track}
      isActive={currentTrack?.id === track.id}
      onPress={() => {
        if (currentTrack?.id !== track.id) {
          playTrack(track);
        }
      }}
    />
  ), [currentTrack?.id, playTrack]);

   const renderFooter = useCallback(() => {
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
  }, [isLoadingMore, hasMore, songs.length]);

   const keyExtractor = useCallback((item: Track) => item.id, []);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), []);

   const ListHeader = useMemo(() => (
    <View style={styles.listContent}>
      {ListHeaderComponent && <ListHeaderComponent />}
      <View style={styles.sectionHeader}>
        <Text variant="heading">Song List</Text>
        <SeeAll />
      </View>
    </View>
  ), [ListHeaderComponent]);

  const containerStyle = useMemo(() => (
    [styles.container, { paddingBottom: listPadding }]
  ), [listPadding]);

  return (
    <View style={containerStyle}>
      <FlatList
        ListHeaderComponent={ListHeader}
        ListHeaderComponentStyle={styles.listContent}
        data={songs}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        onEndReached={loadMoreSongs}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={5}
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