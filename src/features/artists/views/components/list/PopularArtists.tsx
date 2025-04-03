import { Text } from '@/components/atoms';
import { ErrorBoundary } from '@/components/layout/error-boundary/ErrorBoundary';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { usePopularArtists } from '../../../hooks';
import { PopularArtistCard } from '../card/PopularArtistCard';

export function PopularArtists() {
   const { data, isLoading, error } = usePopularArtists(5);

   return (
      <View style={{ marginTop: 24 }}>
         <Text variant="heading" style={{ paddingHorizontal: 20, marginBottom: 16 }}>
            Popular Artists
         </Text>
         <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}
         >
            <ErrorBoundary
               isLoading={isLoading}
               fallback={
                  <ActivityIndicator style={{ paddingHorizontal: 20, paddingVertical: 30 }} />
               }
            >
               {data?.length ? (
                  data.map(artist => <PopularArtistCard artist={artist} key={artist.id} />)
               ) : (
                  <Text style={{ paddingHorizontal: 20, fontStyle: 'italic' }}>
                     No artists found
                  </Text>
               )}
            </ErrorBoundary>
         </ScrollView>
      </View>
   );
}
