import { View, StyleSheet } from "react-native";
import { SeeAll, Text } from "@/components/atoms";
import { ALL_ARTISTS } from "../../sample/sample";
import ArtistCard from "./components/ArtistCard";
import { PLAYER_BAR_HEIGHT } from "@/constants/dimensions";

const styles = StyleSheet.create({
  section: {
    marginTop: 24,
    paddingBottom: PLAYER_BAR_HEIGHT + 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
})

export function ArtistList(): React.ReactElement {
  return (
    < View style={styles.section} >
      <View style={styles.sectionHeader}>
        <Text variant="heading">Artists</Text>
        <SeeAll onPress={() => { }} />
      </View>
      {
        ALL_ARTISTS.map((artist) => (
          <ArtistCard
            artist={artist}
            key={artist.id}
          />
        ))
      }
    </View >
  )
}

export default ArtistList;
