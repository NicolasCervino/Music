import { SeeAll, Text } from '@/components/atoms';
import { ErrorBoundary } from '@/components/layout/error-boundary/ErrorBoundary';

import { PLAYER_BAR_HEIGHT } from '@/src/constants/dimensions';
import { ActivityIndicator, View } from 'react-native';
import { useArtists } from '../../../hooks';
import { ArtistCard } from '../card/ArtistCard';

export function ArtistList(): React.ReactElement {
   const { data: artists, isLoading } = useArtists();

   return (
      <View style={{ marginTop: 24, paddingBottom: PLAYER_BAR_HEIGHT + 16 }}>
         <View
            style={{
               flexDirection: 'row',
               justifyContent: 'space-between',
               alignItems: 'center',
               paddingHorizontal: 20,
               marginBottom: 16,
            }}
         >
            <Text variant="heading">Artists</Text>
            <SeeAll onPress={() => {}} />
         </View>
         <ErrorBoundary
            isLoading={isLoading}
            fallback={<ActivityIndicator style={{ padding: 20 }} />}
         >
            {artists?.length ? (
               artists.map(artist => <ArtistCard artist={artist} key={artist.id} />)
            ) : (
               <Text style={{ paddingHorizontal: 20, fontStyle: 'italic' }}>No artists found</Text>
            )}
         </ErrorBoundary>
      </View>
   );
}
