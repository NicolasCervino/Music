import { View, ScrollView, StyleSheet } from "react-native";
import { Text } from "@/components/atoms";
import { POPULAR_ARTISTS } from "../../sample/sample";
import PopularArtistCard from "./components/PopularArtistCard";

const styles = StyleSheet.create({
  artistSection: {
    marginTop: 24,
  },
  artistTitle: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  popularScrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
})

export function PopularArtists() {

  return (
    <View style={styles.artistSection}>
      <Text variant="heading" style={styles.artistTitle}>Popular Artists</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.popularScrollContent}
      >
        {POPULAR_ARTISTS.map((artist) => (
          <PopularArtistCard artist={artist} key={artist.id} />
        ))}
      </ScrollView>
    </View>
  )
}

export default PopularArtists;