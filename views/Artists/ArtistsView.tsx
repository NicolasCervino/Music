import { useTheme } from "@/theme";
import { ScrollView, StyleSheet } from "react-native";
import { ArtistList, PopularArtists } from "@/packages/Artists";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 24,
  },
});

export default function ArtistsView() {
  const { theme } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <PopularArtists />
      <ArtistList />
    </ScrollView>
  );
}