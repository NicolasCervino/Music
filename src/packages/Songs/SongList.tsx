import { Text } from '@/components/atoms';
import { ErrorBoundary } from '@/components/layout/error-boundary/ErrorBoundary';
import { PLAYER_BAR_HEIGHT } from '@/constants/dimensions';
import { Track } from '@/entities';
import { FlashList } from '@shopify/flash-list';
import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { ListFooter } from './components/ListFooter';
import { SongListSkeleton } from './components/skeleton/SongListSkeleton';
import { SongListHeader } from './components/SongListHeader';
import { TrackBanner } from './components/TrackBanner';
import { SongListHookResult } from './hooks/useSongList';
import { utils } from './utils';

const ITEM_HEIGHT = 76;

export interface SongListProps extends SongListHookResult {
   renderHeader?: () => React.ReactNode;
}

export function SongList({
   songs,
   activeTrackId,
   isPlayerVisible,
   isLoading,
   isError,
   pagination,
   onPlayTrack,
   onShufflePlay,
   renderHeader,
}: SongListProps) {
   const listPadding = isPlayerVisible ? PLAYER_BAR_HEIGHT + 16 : 0;

   const containerStyle = useMemo(() => ({ flex: 1, paddingBottom: listPadding }), [listPadding]);

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
      <View style={containerStyle}>
         <ErrorBoundary isLoading={isLoading} fallback={<SongListSkeleton count={8} />}>
            <FlashList
               estimatedItemSize={ITEM_HEIGHT}
               ListHeaderComponent={
                  <SongListHeader
                     renderHeader={renderHeader}
                     onShufflePlay={onShufflePlay}
                     songsAvailable={songs.length > 0}
                  />
               }
               ListHeaderComponentStyle={{ paddingHorizontal: 10 }}
               data={songs}
               renderItem={renderItem}
               onEndReached={pagination.onLoadMore}
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
