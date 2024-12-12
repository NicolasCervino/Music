import { useTheme } from "@/theme";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import { Text } from "@/components/atoms";
import { Image } from "expo-image";
import { SAMPLE_ALBUMS } from "@/packages/Albums/sample";
import { SAMPLE_SONGS } from "@/packages/Songs/sample";
import { NewAlbums } from "@/packages/Albums/NewAlbums";
import { SongList } from "@/packages/Songs/SongList";

export default function HomeView() {
  const { theme } = useTheme();

  const renderHeader = () => (
    <NewAlbums />
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SongList ListHeaderComponent={renderHeader} />
    </View>
  );
}