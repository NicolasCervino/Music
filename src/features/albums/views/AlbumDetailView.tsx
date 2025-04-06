import { Text } from '@/components/atoms';
import { ErrorBoundary } from '@/components/layout/error-boundary/ErrorBoundary';
import { Track } from '@/src/entities';
import { SongList } from '@/src/packages';
import { useTheme } from '@/theme';
import { View } from 'react-native';
import { useAlbumTracks } from '../hooks';
import { AlbumHeader } from './components/AlbumHeader';

interface AlbumDetailViewProps {
   methods: ReturnType<typeof useAlbumTracks>;
}

export function AlbumDetailView({ methods }: AlbumDetailViewProps): React.ReactElement {
   const { theme } = useTheme();
   const tracks = methods.data?.tracks || [];

   const onPlayAll = (allTracks: Track[]) => {
      if (allTracks.length > 0) {
         methods.onPlayTrack(allTracks[0]);
      }
   };

   if (methods.isError) {
      return (
         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Error loading album tracks</Text>
         </View>
      );
   }

   const renderAlbumHeader = () => (
      <AlbumHeader
         album={methods.album || null}
         trackCount={tracks.length}
         tracks={tracks}
         onPlayAll={onPlayAll}
         onShufflePlay={methods.onShufflePlay}
      />
   );

   return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
         <ErrorBoundary isLoading={methods.isLoading} fallback={<View style={{ height: 300 }} />}>
            <SongList
               title={'Tracks'}
               songs={tracks}
               isLoading={methods.isLoading}
               isError={methods.isError}
               pagination={{ onLoadMore: () => {}, hasMore: false, isFetching: false }}
               onPlayTrack={methods.onPlayTrack}
               activeTrackId={methods.activeTrackId}
               isPlayerVisible={methods.isPlayerVisible}
               renderHeader={renderAlbumHeader}
               onShufflePlay={methods.onShufflePlay}
            />
         </ErrorBoundary>
      </View>
   );
}
