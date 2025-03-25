import { SeeAll, Text } from '@/components/atoms';
import { Image } from 'expo-image';
import { memo, useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SAMPLE_ALBUMS } from './sample';
import { Album } from './types';

const ALBUM_WIDTH = 150;
const ALBUM_HEIGHT = 150;

const AlbumCard = memo(({ album }: { album: Album }) => (
  <Pressable style={styles.albumCard}>
    <Image
      source={{ uri: album.artwork }}
      style={styles.artwork}
      contentFit="cover"
      cachePolicy="memory-disk"
      transition={200}
    />
    <Text variant="subtitle" style={styles.title}>{album.title}</Text>
    <Text variant="caption" style={styles.artist}>{album.artist}</Text>
  </Pressable>
));

export const NewAlbums = memo(function NewAlbums() {
  const renderAlbum = useCallback(({ item: album }: { item: Album }) => (
    <AlbumCard album={album} />
  ), []);

  const keyExtractor = useCallback((item: Album) => item.id, []);

  const getItemLayout = useCallback((
    _data: ArrayLike<Album> | null | undefined,
    index: number
  ) => ({
    length: ALBUM_WIDTH + 16, // Width + marginRight
    offset: (ALBUM_WIDTH + 16) * index,
    index,
  }), []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
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
        contentContainerStyle={styles.listContent}
        snapToInterval={ALBUM_WIDTH + 16} // Width + marginRight
        decelerationRate="fast"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  albumCard: {
    width: ALBUM_WIDTH,
    marginRight: 16,
  },
  artwork: {
    width: ALBUM_WIDTH,
    height: ALBUM_HEIGHT,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
  },
  title: {
    marginBottom: 4,
  },
  artist: {
    opacity: 0.7,
  },
});