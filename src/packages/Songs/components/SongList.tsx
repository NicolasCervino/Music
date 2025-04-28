import { Text } from '@/components/atoms';
import { MenuOption } from '@/components/atoms/ContextMenu';
import { ErrorBoundary } from '@/components/layout/error-boundary/ErrorBoundary';
import { PLAYER_BAR_HEIGHT } from '@/constants/dimensions';
import { Track } from '@/entities';
import { CollapsibleList } from '@/src/components/widgets';
import { useCallback } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { SongListHookResult } from '../hooks/useSongList';
import { SongListSkeleton } from './skeleton/SongListSkeleton';
import { TrackBanner } from './TrackBanner';

const ITEM_HEIGHT = 76;

export interface SongListProps extends SongListHookResult {
   renderHeader?: () => React.ReactNode;
   initialVisibleCount?: number;
   headerStyle?: StyleProp<ViewStyle>;
   trackMenuOptions?: (track: Track) => MenuOption[] | undefined;
}

export function SongList({
   title = '',
   songs,
   activeTrackId,
   isPlayerVisible,
   isLoading,
   isError,
   pagination,
   onPlayTrack,
   renderHeader,
   headerStyle,
   initialVisibleCount = 5,
   trackMenuOptions,
}: SongListProps & { title?: string }) {
   const listPadding = isPlayerVisible ? PLAYER_BAR_HEIGHT : 0;

   const renderSongItem = useCallback(
      ({ item: track }: { item: Track }) => {
         const isActive = track.id === activeTrackId;
         const menuOptions = trackMenuOptions ? trackMenuOptions(track) : undefined;

         return (
            <TrackBanner
               track={track}
               isActive={isActive}
               onPress={() => onPlayTrack(track)}
               menuOptions={menuOptions}
            />
         );
      },
      [activeTrackId, onPlayTrack, trackMenuOptions]
   );

   const keyExtractor = (item: Track) => `track-${item.id}-${item.title}`;

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

   if (!isLoading && songs.length === 0) {
      return (
         <View style={{ flex: 1 }}>
            {title && (
               <View
                  style={{
                     paddingHorizontal: 20,
                     paddingVertical: 16,
                  }}
               >
                  <Text variant="heading">{title}</Text>
               </View>
            )}
            <View
               style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 40,
               }}
            >
               <Text variant="subtitle">No songs found on this device.</Text>
            </View>
         </View>
      );
   }

   return (
      <ErrorBoundary isLoading={isLoading} fallback={<SongListSkeleton count={8} />}>
         <CollapsibleList
            title={title}
            data={songs}
            renderItem={renderSongItem}
            keyExtractor={keyExtractor}
            renderHeader={renderHeader}
            headerStyle={headerStyle}
            initialVisibleCount={initialVisibleCount}
            estimatedItemSize={ITEM_HEIGHT}
            bottomPadding={listPadding}
            isLoading={isLoading}
            fallback={<SongListSkeleton count={8} />}
            onLoadMore={pagination.onLoadMore}
            extraData={activeTrackId}
         />
      </ErrorBoundary>
   );
}
