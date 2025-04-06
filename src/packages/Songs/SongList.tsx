import { SeeAll, Text } from '@/components/atoms';
import { ErrorBoundary } from '@/components/layout/error-boundary/ErrorBoundary';
import { PLAYER_BAR_HEIGHT } from '@/constants/dimensions';
import { Track } from '@/entities';
import { useTheme } from '@/src/theme';
import { FlashList } from '@shopify/flash-list';
import { useCallback, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { ListFooter } from './components/ListFooter';
import { SongListSkeleton } from './components/skeleton/SongListSkeleton';
import { TrackBanner } from './components/TrackBanner';
import { SongListHookResult } from './hooks/useSongList';
import { utils } from './utils';

const ITEM_HEIGHT = 76;

export interface SongListProps extends SongListHookResult {
   renderHeader?: () => React.ReactNode;
   initialVisibleCount?: number;
}

export function SongList({
   songs,
   activeTrackId,
   isPlayerVisible,
   isLoading,
   isError,
   pagination,
   onPlayTrack,
   renderHeader,
   initialVisibleCount = 5,
}: SongListProps) {
   const [expanded, setExpanded] = useState(false);
   const listPadding = isPlayerVisible ? PLAYER_BAR_HEIGHT : 0;
   const listRef = useRef<FlashList<Track>>(null);
   const { theme } = useTheme();

   const displayedSongs = useMemo(() => {
      return expanded ? songs : songs.slice(0, initialVisibleCount);
   }, [expanded, songs, initialVisibleCount]);

   const toggleExpand = useCallback(() => {
      setExpanded(prev => {
         setTimeout(() => {
            listRef.current?.scrollToIndex({
               index: !prev ? (initialVisibleCount > 0 ? initialVisibleCount - 1 : 0) : 0,
               animated: true,
            });
         }, 100);

         return !prev;
      });
   }, [initialVisibleCount]);

   const keyExtractor = useCallback((item: Track) => {
      return `track-${utils.hashString(item.id)}-${item.title}`;
   }, []);

   const renderItem = useCallback(
      ({ item: track }: { item: Track }) => {
         const isActive = track.id === activeTrackId;

         return (
            <TrackBanner track={track} isActive={isActive} onPress={() => onPlayTrack(track)} />
         );
      },
      [activeTrackId, onPlayTrack]
   );

   if (isError) {
      return (
         <View
            style={{
               padding: 16,
               alignItems: 'center',
               flexDirection: 'row',
               justifyContent: 'center',
            }}
         >
            <Text>Error loading songs</Text>
         </View>
      );
   }

   return (
      <View style={{ flex: 1, paddingBottom: listPadding }}>
         <ErrorBoundary isLoading={isLoading} fallback={<SongListSkeleton count={8} />}>
            {renderHeader && !expanded && (
               <View style={{ paddingHorizontal: 20 }}>{renderHeader()}</View>
            )}
            <View
               style={{
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                  backgroundColor: theme.colors.background,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
               }}
            >
               <Text variant="heading">Song List</Text>
               <SeeAll onPress={toggleExpand} expanded={expanded} />
            </View>
            <FlashList
               ref={listRef}
               estimatedItemSize={ITEM_HEIGHT}
               ListHeaderComponentStyle={{ paddingHorizontal: 10 }}
               data={displayedSongs}
               renderItem={renderItem}
               onEndReached={expanded ? pagination.onLoadMore : undefined}
               onEndReachedThreshold={0.5}
               extraData={activeTrackId}
               ListFooterComponent={
                  <ListFooter
                     isLoadingMore={pagination.isFetching}
                     hasMore={!!pagination.hasMore}
                     songsLength={songs.length}
                  />
               }
               showsVerticalScrollIndicator={false}
               contentContainerStyle={{ paddingHorizontal: 10 }}
               drawDistance={ITEM_HEIGHT * 10}
               maintainVisibleContentPosition={{
                  minIndexForVisible: 0,
               }}
               keyExtractor={keyExtractor}
            />
         </ErrorBoundary>
      </View>
   );
}
