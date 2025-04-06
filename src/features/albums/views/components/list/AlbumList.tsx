import { ErrorBoundary } from '@/components/layout/error-boundary/ErrorBoundary';
import { CollapsibleList } from '@/src/components/widgets';
import { PLAYER_BAR_HEIGHT } from '@/src/constants/dimensions';
import { Album } from '@/src/entities';
import { Href, useRouter } from 'expo-router';
import { View } from 'react-native';
import { useAlbums } from '../../../hooks';
import { AlbumItem } from '../item/AlbumItem';

const ITEM_HEIGHT = 160; // Altura estimada para cada elemento de álbum

export interface AlbumListProps {
   initialVisibleCount?: number;
   expanded: boolean;
   onExpandToggle: () => void;
   renderHeader?: () => React.ReactNode;
   isPlayerVisible: boolean;
}

export function AlbumList({
   initialVisibleCount = 6,
   expanded,
   onExpandToggle,
   renderHeader,
   isPlayerVisible,
}: AlbumListProps): React.ReactElement {
   const { data: albums = [], isLoading } = useAlbums();
   const listPadding = isPlayerVisible ? PLAYER_BAR_HEIGHT : 0;
   const router = useRouter();

   const renderAlbumItem = ({ item: album }: { item: Album }) => (
      <AlbumItem
         album={album}
         onPress={() => router.push(`/album/${album.id}` as unknown as Href)}
      />
   );

   const keyExtractor = (item: Album) => `album-${item.id}`;

   return (
      <ErrorBoundary isLoading={isLoading} fallback={<View style={{ height: 300 }} />}>
         <CollapsibleList
            title="Albums"
            data={albums}
            renderItem={renderAlbumItem}
            keyExtractor={keyExtractor}
            renderHeader={renderHeader}
            initialVisibleCount={initialVisibleCount}
            estimatedItemSize={ITEM_HEIGHT}
            bottomPadding={listPadding}
            isLoading={isLoading}
            fallback={<View style={{ height: 300 }} />}
            expanded={expanded}
            onExpandToggle={onExpandToggle}
            numColumns={2}
         />
      </ErrorBoundary>
   );
}
