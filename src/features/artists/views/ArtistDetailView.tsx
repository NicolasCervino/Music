import { Text } from '@/components/atoms';
import { ErrorBoundary } from '@/components/layout/error-boundary/ErrorBoundary';
import { SongList } from '@/packages/Songs/SongList';
import { Track } from '@/src/entities';
import { useTheme } from '@/theme';
import { View } from 'react-native';
import { useArtistSongs } from '../hooks';
import { ArtistHeader } from './components/ArtistHeader';

interface ArtistDetailViewProps {
   methods: ReturnType<typeof useArtistSongs>;
}

export function ArtistDetailView({ methods }: ArtistDetailViewProps): React.ReactElement {
   const { theme } = useTheme();
   const songs = methods.data?.songs || [];

   const handlePlayAll = (allSongs: Track[]) => {
      if (allSongs.length > 0) {
         methods.onPlayTrack(allSongs[0]);
      }
   };

   if (methods.isError) {
      return (
         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Error loading artist songs</Text>
         </View>
      );
   }

   const renderArtistHeader = () => (
      <ArtistHeader
         artist={methods.artist || null}
         songCount={songs.length}
         songs={songs}
         onPlayAll={handlePlayAll}
      />
   );

   return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
         <ErrorBoundary isLoading={methods.isLoading} fallback={<View style={{ height: 300 }} />}>
            <SongList
               title={'Songs'}
               songs={songs}
               isLoading={methods.isLoading}
               isError={methods.isError}
               pagination={{ onLoadMore: () => {}, hasMore: false, isFetching: false }}
               onPlayTrack={methods.onPlayTrack}
               activeTrackId={methods.activeTrackId}
               isPlayerVisible={methods.isPlayerVisible}
               renderHeader={renderArtistHeader}
            />
         </ErrorBoundary>
      </View>
   );
}
