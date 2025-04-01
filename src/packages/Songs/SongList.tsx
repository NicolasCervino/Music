import { SeeAll, Text } from '@/components/atoms';
import { PLAYER_BAR_HEIGHT } from '@/constants/dimensions';
import { Track } from '@/entities';
import { useCurrentTrack, usePlayerControls, useTracks } from '@/features/player';
import { FlashList } from '@shopify/flash-list';
import { memo, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { TrackBanner } from './components/TrackBanner';

const ITEM_HEIGHT = 76;

// Memoize the TrackBanner component
const MemoizedTrackBanner = memo(TrackBanner);

// Memoize the footer component
const ListFooter = memo(({ isLoadingMore, hasMore, songsLength }: { 
  isLoadingMore: boolean; 
  hasMore: boolean; 
  songsLength: number;
}) => {
  if (isLoadingMore) {
    return (
      <View style={styles.footer}>
        <Text>Loading more songs...</Text>
      </View>
    );
  }
  if (!hasMore && songsLength > 0) {
    return (
      <View style={styles.footer}>
        <Text>No more songs</Text>
      </View>
    );
  }
  return null;
});

export function SongList({ ListHeaderComponent }: { ListHeaderComponent?: React.ComponentType<any> }) {
  // 1. Group all hooks at the top
  const { data: currentTrack } = useCurrentTrack();
  const { 
    data: tracksData, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    isLoading,
    isError
  } = useTracks();
  const controls = usePlayerControls();

  // 2. Move all memoized values together
  const songs = useMemo(() => {
    if (!tracksData?.pages) return [];
    return tracksData.pages.flatMap(page => page.tracks);
  }, [tracksData?.pages]);

  const isVisible = !!currentTrack;
  const listPadding = isVisible ? PLAYER_BAR_HEIGHT + 16 : 0;

  const containerStyle = useMemo(() => [
    styles.container,
    { paddingBottom: listPadding }
  ], [listPadding]);

  const ListHeader = useMemo(() => (
    <View style={styles.listContent}>
      {ListHeaderComponent && <ListHeaderComponent />}
      <View style={styles.sectionHeader}>
        <Text variant="heading">Song List</Text>
        <SeeAll />
      </View>
    </View>
  ), [ListHeaderComponent]);

  const renderItem = useCallback(({ item: track }: { item: Track }) => (
    <MemoizedTrackBanner
      track={track}
      isActive={currentTrack?.id === track.id}
      onPress={() => {
        if (currentTrack?.id !== track.id) {
          controls.playTrack({ track, allTracks: songs });
        }
      }}
    />
  ), [currentTrack?.id, controls, songs]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage().catch(error => {
        console.error('Error fetching next page:', error);
      });
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isError) {
    return (
      <View style={styles.footer}>
        <Text>Error loading songs</Text>
      </View>
    );
  }


  return (
    <View style={containerStyle}>
      <FlashList
        estimatedItemSize={ITEM_HEIGHT}
        ListHeaderComponent={ListHeader}
        ListHeaderComponentStyle={styles.listContent}
        data={songs}
        renderItem={renderItem}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          <ListFooter 
            isLoadingMore={isFetchingNextPage} 
            hasMore={!!hasNextPage} 
            songsLength={songs.length} 
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        drawDistance={ITEM_HEIGHT * 10}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
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