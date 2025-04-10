import { ErrorBoundary } from '@/components/layout/error-boundary/ErrorBoundary';
import { CollapsibleList } from '@/src/components/widgets';
import { PLAYER_BAR_HEIGHT } from '@/src/constants/dimensions';
import { Playlist } from '@/src/entities';
import { Href, useRouter } from 'expo-router';
import { StyleProp, View, ViewStyle } from 'react-native';
import { usePlaylists } from '../../../hooks/usePlaylists';
import { PlaylistCard } from '../item/PlaylistCard';

const ITEM_HEIGHT = 76; // Height of each playlist row

export interface PlaylistListProps {
   initialVisibleCount?: number;
   expanded: boolean;
   onExpandToggle: () => void;
   renderHeader?: () => React.ReactNode;
   headerStyle?: StyleProp<ViewStyle>;
   isPlayerVisible: boolean;
}

export function PlaylistList({
   initialVisibleCount = 5,
   expanded,
   onExpandToggle,
   renderHeader,
   headerStyle,
   isPlayerVisible,
}: PlaylistListProps): React.ReactElement {
   const { data: playlists = [], isLoading } = usePlaylists();
   const listPadding = isPlayerVisible ? PLAYER_BAR_HEIGHT : 0;
   const router = useRouter();

   const renderPlaylistItem = ({ item: playlist }: { item: Playlist }) => (
      <PlaylistCard
         playlist={playlist}
         onPress={() => router.push(`/playlist/${playlist.id}` as unknown as Href)}
      />
   );

   const keyExtractor = (item: Playlist) => `playlist-${item.id}`;

   return (
      <ErrorBoundary isLoading={isLoading} fallback={<View style={{ height: 300 }} />}>
         <CollapsibleList
            title="Playlists"
            data={playlists}
            renderItem={renderPlaylistItem}
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
