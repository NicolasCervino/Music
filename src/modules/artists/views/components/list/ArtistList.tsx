import { ErrorBoundary } from '@/components/layout/error-boundary/ErrorBoundary';
import { CollapsibleList } from '@/src/components/widgets';
import { PLAYER_BAR_HEIGHT } from '@/src/constants/dimensions';
import { Artist } from '@/src/entities';
import { Href, useRouter } from 'expo-router';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useArtists } from '../../../hooks';
import { ArtistCard } from '../card/ArtistCard';

const ITEM_HEIGHT = 76; // Height of each artist row

export interface ArtistListProps {
   initialVisibleCount?: number;
   expanded: boolean;
   onExpandToggle: () => void;
   renderHeader?: () => React.ReactNode;
   headerStyle?: StyleProp<ViewStyle>;
   isPlayerVisible: boolean;
}

export function ArtistList({
   initialVisibleCount = 5,
   expanded,
   onExpandToggle,
   renderHeader,
   headerStyle,
   isPlayerVisible,
}: ArtistListProps): React.ReactElement {
   const { data: artists = [], isLoading } = useArtists();
   const listPadding = isPlayerVisible ? PLAYER_BAR_HEIGHT : 0;
   const router = useRouter();

   const renderArtistItem = ({ item: artist }: { item: Artist }) => (
      <ArtistCard
         artist={artist}
         onPress={() => router.push(`/artist/${artist.id}` as unknown as Href)}
      />
   );

   const keyExtractor = (item: Artist) => `artist-${item.id}`;

   return (
      <ErrorBoundary isLoading={isLoading} fallback={<View style={{ height: 300 }} />}>
         <CollapsibleList
            title="Artists"
            data={artists}
            renderItem={renderArtistItem}
            keyExtractor={keyExtractor}
            renderHeader={renderHeader}
            headerStyle={headerStyle}
            initialVisibleCount={initialVisibleCount}
            estimatedItemSize={ITEM_HEIGHT}
            bottomPadding={listPadding}
            isLoading={isLoading}
            fallback={<View style={{ height: 300 }} />}
            expanded={expanded}
            onExpandToggle={onExpandToggle}
         />
      </ErrorBoundary>
   );
}
