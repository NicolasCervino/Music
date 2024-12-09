import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/atoms';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { usePlayer } from '@/packages/MusicPlayer/hooks/usePlayer';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type PlayerViewProps = {
  backgroundColor: string;
  isReady: boolean;
}

export default function ExpandedPlayerView({ backgroundColor, isReady }: PlayerViewProps) {
  const {
    currentTrack,
    isPlaying,
    handleArtworkLoad,
    pauseTrack,
    resumeTrack,
  } = usePlayer();
  const insets = useSafeAreaInsets();

  if (!currentTrack) return null;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isReady ? backgroundColor : 'transparent',
          opacity: isReady ? 1 : 0,
          paddingTop: insets.top, // Add this
          marginTop: -insets.top, // Add this
        }
      ]}
    >
      <Image
        source={{ uri: currentTrack.artwork }}
        style={styles.artwork}
        contentFit="cover"
        onLoad={handleArtworkLoad}
      />

      <View style={styles.songInfo}>
        <Text style={styles.title}>{currentTrack.title}</Text>
        <Text style={styles.artist}>{currentTrack.artist}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity>
          <Ionicons name="shuffle" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="play-skip-back" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playButton}
          onPress={isPlaying ? pauseTrack : resumeTrack}
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={32}
            color="black"
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="play-skip-forward" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="repeat" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  artwork: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    marginVertical: 32,
  },
  songInfo: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  artist: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});