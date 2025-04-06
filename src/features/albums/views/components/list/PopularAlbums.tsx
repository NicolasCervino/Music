import { Text } from '@/components/atoms';
import { ErrorBoundary } from '@/components/layout/error-boundary/ErrorBoundary';
import { Album } from '@/src/entities';
import { Href, useRouter } from 'expo-router';
import { FlatList, View } from 'react-native';
import { usePopularAlbums } from '../../../hooks';
import { PopularAlbumItem } from '../item/PopularAlbumItem';

export function PopularAlbums() {
   const { data: albums = [], isLoading } = usePopularAlbums(6);
   const router = useRouter();

   const renderAlbumItem = ({ item: album }: { item: Album }) => (
      <PopularAlbumItem
         album={album}
         onPress={() => router.push(`/album/${album.id}` as unknown as Href)}
      />
   );

   const keyExtractor = (item: Album) => item.id;

   return (
      <View style={{ paddingTop: 24, paddingBottom: 24 }}>
         <View
            style={{
               flexDirection: 'row',
               justifyContent: 'space-between',
               alignItems: 'center',
               marginBottom: 16,
               paddingHorizontal: 0,
            }}
         >
            <Text variant="heading">Popular Albums</Text>
         </View>
         <ErrorBoundary isLoading={isLoading} fallback={<View style={{ height: 200 }} />}>
            {albums.length ? (
               <FlatList
                  horizontal
                  data={albums}
                  renderItem={renderAlbumItem}
                  keyExtractor={keyExtractor}
                  showsHorizontalScrollIndicator={false}
                  removeClippedSubviews={true}
                  maxToRenderPerBatch={4}
                  initialNumToRender={3}
                  windowSize={3}
                  contentContainerStyle={{ paddingHorizontal: 10 }}
               />
            ) : (
               <Text style={{ paddingHorizontal: 20, fontStyle: 'italic' }}>No albums found</Text>
            )}
         </ErrorBoundary>
      </View>
   );
}
