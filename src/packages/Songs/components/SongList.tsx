import { Text } from '@/components/atoms';
import { ErrorBoundary } from '@/components/layout/error-boundary/ErrorBoundary';
import { PLAYER_BAR_HEIGHT } from '@/constants/dimensions';
import { Track } from '@/entities';
import { CollapsibleList } from '@/src/components/widgets';
import { StyleProp, View, ViewStyle } from 'react-native';
import { SongListHookResult } from '../hooks/useSongList';
import { SongListSkeleton } from './skeleton/SongListSkeleton';
import { TrackBanner } from './TrackBanner';

const ITEM_HEIGHT = 76;

export interface SongListProps extends SongListHookResult {
   renderHeader?: () => React.ReactNode;
   initialVisibleCount?: number;
   headerStyle?: StyleProp<ViewStyle>;
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
}: SongListProps & { title?: string }) {
   const listPadding = isPlayerVisible ? PLAYER_BAR_HEIGHT : 0;

   const renderSongItem = ({ item: track }: { item: Track }) => (
      <TrackBanner
         track={track}
         isActive={track.id === activeTrackId}
         onPress={() => onPlayTrack(track)}
      />
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
         />
      </ErrorBoundary>
   );
}
