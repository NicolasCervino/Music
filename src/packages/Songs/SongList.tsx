import { SeeAll, Text } from '@/components/atoms';
import { PLAYER_BAR_HEIGHT } from '@/constants/dimensions';
import { Track } from '@/entities';
import { useCurrentTrack, usePlayerControls, useTracks } from '@/features/player';
import { FlashList } from '@shopify/flash-list';
import { memo, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { TrackBanner } from './components/TrackBanner';

const ITEM_HEIGHT = 76;

// Simple hash function for generating unique keys
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
}

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
  
  // Use current track ID directly, not a separate state
  const activeTrackId = currentTrack?.id;

  // 2. Move all memoized values together
  const songs = useMemo(() => {
    if (!tracksData?.pages) return [];
    
    // Remove duplicates by URL path (ID)
    const uniqueSongs = new Map<string, Track>();
    tracksData.pages.forEach(page => {
      page.tracks.forEach(track => {
        if (!uniqueSongs.has(track.id)) {
          uniqueSongs.set(track.id, track);
        }
      });
    });
    
    const songsArray = Array.from(uniqueSongs.values());
    
    return songsArray;
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

  // Create a truly unique key for each item
  const keyExtractor = useCallback((item: Track) => {
    const baseKey = `track-${hashString(item.id)}-${item.title}`;
    return baseKey;
  }, []);

  const renderItem = useCallback(({ item: track }: { item: Track }) => {
    const isActive = track.id === activeTrackId;
    return (
      <TrackBanner
        track={track}
        isActive={isActive}
        onPress={() => {
          if (track.id !== activeTrackId) {
            controls.playTrack({ track, allTracks: songs });
          }
        }}
      />
    );
  }, [activeTrackId, controls, songs]);

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
        extraData={activeTrackId}
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
        keyExtractor={keyExtractor}
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