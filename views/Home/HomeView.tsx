import { useTheme } from "@/theme";
import { View, ScrollView, Pressable } from "react-native";
import { Text } from "@/components/atoms";
import { Image } from "expo-image";
import { SAMPLE_ALBUMS } from "@/packages/Albums/sample";
import { SAMPLE_SONGS } from "@/packages/Songs/sample";
import { NewAlbums } from "@/packages/Albums/NewAlbums";
import { SongList } from "@/packages/Songs/SongList";

export default function HomeView() {
  const { theme } = useTheme();

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
      showsVerticalScrollIndicator={false}
    >
      <NewAlbums />
      <SongList />
    </ScrollView>
  );
}