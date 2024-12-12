import { Artist } from "@/packages/Artists/types/types";
import { Pressable, View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Text } from "@/components/atoms";
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "@/theme";


const styles = StyleSheet.create({
  artistListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 12,
  },
  artistListImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  artistInfo: {
    flex: 1,
  },
  artistName: {
    marginBottom: 4,
  },
  followers: {
    opacity: 0.7,
    marginBottom: 8,
  },
  genreContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  genreTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  genreText: {
    opacity: 0.8,
  },
})

export function ArtistCard({ artist }: { artist: Artist }) {
  const { theme } = useTheme();

  return (
    <Pressable key={artist.id} style={styles.artistListItem}>
      <Image
        source={{ uri: artist.image }}
        style={styles.artistListImage}
        contentFit="cover"
      />
      <View style={styles.artistInfo}>
        <Text variant="subtitle" style={styles.artistName}>
          {artist.name}
        </Text>
        <Text variant="caption" style={styles.followers}>
          {artist.followers} followers
        </Text>
        <View style={styles.genreContainer}>
          {artist.genres.map((genre, index) => (
            <View
              key={index}
              style={[styles.genreTag, { backgroundColor: theme.colors.card }]}
            >
              <Text variant="caption" style={styles.genreText}>
                {genre}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={theme.colors.text}
        style={{ opacity: 0.6 }}
      />
    </Pressable>
  )
}

export default ArtistCard;
