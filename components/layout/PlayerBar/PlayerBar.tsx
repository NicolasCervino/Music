import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/atoms';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { usePlayerContext } from '@/packages/MusicPlayer/hooks/usePlayerContext';
import { usePlayer } from '@/packages/MusicPlayer/hooks/usePlayer';

export default function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    artworkColor,
    handleArtworkLoad,
    pauseTrack,
    resumeTrack,
    stopTrack,
  } = usePlayer();

  // Don't render if no track is selected
  if (!currentTrack) return null;

  return (
    <View style={{
      height: 68,
      backgroundColor: artworkColor,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      borderRadius: 50,
      gap: 8,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    }}>
      {/* Song info */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
        <Image
          source={{ uri: currentTrack.artwork }}
          style={{ width: 32, height: 32, borderRadius: 4 }}
          contentFit="cover"
          onLoad={handleArtworkLoad}
        />
        <View>
          <Text variant="caption" style={{ color: '#FFFFFF', fontWeight: '500' }}>
            {currentTrack.title}
          </Text>
          <Text variant="caption" style={{ color: '#FFFFFF' }}>
            {currentTrack.artist}
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
        <TouchableOpacity>
          <Ionicons name="play-skip-back" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name={isPlaying ? "pause" : "play"} size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="play-skip-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}