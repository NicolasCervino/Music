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
import { useSongList } from './hooks/useSongList';
import { utils } from './utils';

const ITEM_HEIGHT = 76;

export function SongList({
   listHeaderComponent,
}: {
   listHeaderComponent?: React.ComponentType<any>;
}) {
   const {
      songs,
      activeTrackId,
      currentTrack,
      isLoading,
      isError,
      isFetchingNextPage,
      hasNextPage,
      handlePlayTrack,
      handleEndReached,
   } = useSongList();

   const isVisible = !!currentTrack;
   const listPadding = isVisible ? PLAYER_BAR_HEIGHT + 16 : 0;

   const containerStyle = useMemo(() => ({ flex: 1, paddingBottom: listPadding }), [listPadding]);

   const ListHeader = useMemo(
      () => <SongListHeader ListHeaderComponent={listHeaderComponent} />,
      [listHeaderComponent]
   );

   const keyExtractor = useCallback((item: Track) => {
      return `track-${utils.hashString(item.id)}-${item.title}`;
   }, []);

   const renderItem = useCallback(
      ({ item: track }: { item: Track }) => {
         const isActive = track.id === activeTrackId;

         return (
            <TrackBanner track={track} isActive={isActive} onPress={() => handlePlayTrack(track)} />
         );
      },
      [activeTrackId, handlePlayTrack]
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
         <ErrorBoundary
            isLoading={isLoading}
            fallback={<SongListSkeleton ListHeader={ListHeader} count={8} />}
         >
            <FlashList
               estimatedItemSize={ITEM_HEIGHT}
               ListHeaderComponent={ListHeader}
               ListHeaderComponentStyle={{ paddingHorizontal: 10 }}
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
