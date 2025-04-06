import { SeeAll, Text } from '@/components/atoms';
import { ErrorBoundary } from '@/components/layout/error-boundary/ErrorBoundary';
import { PLAYER_BAR_HEIGHT } from '@/src/constants/dimensions';
import { FlashList } from '@shopify/flash-list';
import { useCallback, useMemo, useRef } from 'react';
import { View } from 'react-native';
import { useArtists } from '../../../hooks';
import { Artist } from '../../../types';
import { ArtistCard } from '../card/ArtistCard';

const ITEM_HEIGHT = 76; // Height of each artist row

export interface ArtistListProps {
   initialVisibleCount?: number;
   expanded: boolean;
   onExpandToggle: () => void;
   renderHeader?: () => React.ReactNode;
}

export function ArtistList({
   initialVisibleCount = 5,
   expanded,
   onExpandToggle,
   renderHeader,
}: ArtistListProps): React.ReactElement {
   const { data: artists = [], isLoading } = useArtists();
   const listRef = useRef<FlashList<Artist>>(null);
   const listPadding = PLAYER_BAR_HEIGHT;

   const displayedArtists = useMemo(() => {
      return expanded ? artists : artists.slice(0, initialVisibleCount);
   }, [expanded, artists, initialVisibleCount]);

   const keyExtractor = useCallback((item: Artist) => `artist-${item.id}`, []);

   const toggleExpand = useCallback(() => {
      onExpandToggle();
      setTimeout(() => {
         if (listRef.current) {
            const targetIndex = !expanded ? 0 : Math.max(0, initialVisibleCount - 1);
            listRef.current.scrollToIndex({ index: targetIndex, animated: true });
         }
      }, 50);
   }, [expanded, initialVisibleCount, onExpandToggle]);

   const renderItem = useCallback(
      ({ item: artist }: { item: Artist }) => <ArtistCard artist={artist} />,
      []
   );

   return (
      <View style={{ flex: 1, paddingBottom: listPadding }}>
         <ErrorBoundary isLoading={isLoading} fallback={<View style={{ height: 300 }} />}>
            {renderHeader && !expanded && (
               <View style={{ paddingHorizontal: 20 }}>{renderHeader()}</View>
            )}
            <View
               style={{
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
               }}
            >
               <Text variant="heading">Artists</Text>
               <SeeAll onPress={toggleExpand} expanded={expanded} />
            </View>

            <View style={{ flex: 1 }}>
               <FlashList
                  ref={listRef}
                  estimatedItemSize={ITEM_HEIGHT}
                  data={displayedArtists}
                  renderItem={renderItem}
                  keyExtractor={keyExtractor}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 10 }}
                  drawDistance={ITEM_HEIGHT * 10}
                  maintainVisibleContentPosition={{
                     minIndexForVisible: 0,
                  }}
               />
            </View>
         </ErrorBoundary>
      </View>
   );
}
