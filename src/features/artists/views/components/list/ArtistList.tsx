import { ErrorBoundary } from '@/components/layout/error-boundary/ErrorBoundary';
import { CollapsibleList } from '@/src/components/widgets';
import { PLAYER_BAR_HEIGHT } from '@/src/constants/dimensions';
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
   const listPadding = PLAYER_BAR_HEIGHT;

   const renderArtistItem = ({ item: artist }: { item: Artist }) => <ArtistCard artist={artist} />;

   const keyExtractor = (item: Artist) => `artist-${item.id}`;

   return (
      <ErrorBoundary isLoading={isLoading} fallback={<View style={{ height: 300 }} />}>
         <CollapsibleList
            title="Artists"
            data={artists}
            renderItem={renderArtistItem}
            keyExtractor={keyExtractor}
            renderHeader={renderHeader}
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
