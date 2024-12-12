import { View, ScrollView, Pressable, StyleSheet, FlatList } from 'react-native';
import { Text, SeeAll } from '@/components/atoms';
import { Image } from 'expo-image';

type Album = {
  id: string;
  title: string;
  artist: string;
  artwork: string;
};

const SAMPLE_ALBUMS: Album[] = [
  {
    id: '1',
    title: 'The Wave',
    artist: 'Kumariyah',
    artwork: 'https://picsum.photos/200',
  },
  {
    id: '2',
    title: 'Safe Travels',
    artist: 'Jack Doe',
    artwork: 'https://picsum.photos/201',
  },
  {
    id: '3',
    title: 'From Time',
    artist: 'Drake',
    artwork: 'https://picsum.photos/202',
  },
];

export function NewAlbums() {
  const renderAlbum = ({ item: album }: { item: Album }) => (
    <Pressable style={styles.albumCard}>
      <Image
        source={{ uri: album.artwork }}
        style={styles.artwork}
        contentFit="cover"
      />
      <Text variant="subtitle" style={styles.title}>{album.title}</Text>
      <Text variant="caption" style={styles.artist}>{album.artist}</Text>
    </Pressable>
  );

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
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

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
  },
  albumCard: {
    width: 150,
    marginRight: 16,
  },
  artwork: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    marginBottom: 4,
  },
  artist: {
    opacity: 0.7,
  },
});