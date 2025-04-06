import { Text } from '@/components/atoms';
import { ErrorBoundary } from '@/components/layout/error-boundary/ErrorBoundary';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { usePopularArtists } from '../../../hooks';
import { Artist } from '../../../types';
import { PopularArtistCard } from '../card/PopularArtistCard';

export function PopularArtists() {
   const { data, isLoading } = usePopularArtists(5);

   const renderArtist = ({ item }: { item: Artist }) => <PopularArtistCard artist={item} />;
   const keyExtractor = (item: Artist) => item.id;

   return (
      <View style={{ paddingTop: 24 }}>
         <View
            style={{
               flexDirection: 'row',
               justifyContent: 'space-between',
               alignItems: 'center',
               marginBottom: 16,
               paddingHorizontal: 0,
            }}
         >
            <Text variant="heading">Popular Artists</Text>
         </View>
         <ErrorBoundary
            isLoading={isLoading}
            fallback={<ActivityIndicator style={{ paddingHorizontal: 20, paddingVertical: 30 }} />}
         >
            {data?.length ? (
               <FlatList
                  horizontal
                  data={data}
                  renderItem={renderArtist}
                  keyExtractor={keyExtractor}
                  showsHorizontalScrollIndicator={false}
                  removeClippedSubviews={true}
                  maxToRenderPerBatch={4}
                  initialNumToRender={3}
                  windowSize={3}
               />
            ) : (
               <Text style={{ paddingHorizontal: 20, fontStyle: 'italic' }}>No artists found</Text>
            )}
         </ErrorBoundary>
      </View>
   );
}
