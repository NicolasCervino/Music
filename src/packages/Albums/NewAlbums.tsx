import { SeeAll, Text } from '@/components/atoms';
import { memo, useCallback } from 'react';
import { FlatList, View } from 'react-native';
import { AlbumCard } from './components/AlbumCard';
import { SAMPLE_ALBUMS } from './sample';
import { Album } from './types';

const ALBUM_WIDTH = 150;
const ALBUM_HEIGHT = 150;

export const NewAlbums = memo(function NewAlbums() {
   const renderAlbum = useCallback(
      ({ item: album }: { item: Album }) => (
         <AlbumCard album={album} width={ALBUM_WIDTH} height={ALBUM_HEIGHT} />
      ),
      []
   );

   const keyExtractor = useCallback((item: Album) => item.id, []);

   const getItemLayout = useCallback(
      (_data: ArrayLike<Album> | null | undefined, index: number) => ({
         length: ALBUM_WIDTH + 16,
         offset: (ALBUM_WIDTH + 16) * index,
         index,
      }),
      []
   );

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
            <Text variant="heading">New Albums</Text>
            <SeeAll />
         </View>
         <FlatList
            horizontal
            data={SAMPLE_ALBUMS}
            renderItem={renderAlbum}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            showsHorizontalScrollIndicator={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={4}
            initialNumToRender={3}
            windowSize={3}
            snapToInterval={ALBUM_WIDTH + 16}
            decelerationRate="fast"
         />
      </View>
   );
});
