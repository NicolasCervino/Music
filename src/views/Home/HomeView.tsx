import { NewAlbums } from "@/packages/Albums/NewAlbums";
import { SongList } from "@/packages/Songs/SongList";
import { useTheme } from "@/theme";
import { memo, useCallback } from "react";
import { StyleSheet, View } from "react-native";

const Header = memo(() => <NewAlbums />);

export default function HomeView() {
  const { theme } = useTheme();

   const renderHeader = useCallback(() => <Header />, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SongList ListHeaderComponent={renderHeader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});