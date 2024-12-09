import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/atoms';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import { Track } from '@/entities';

type TrackBannerProps = {
  track: Track;
  isActive: boolean;
  onPress: () => void;
};

export function TrackBanner({ track, isActive, onPress }: TrackBannerProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={[styles.trackItem, isActive && styles.activeTrack]}
      onPress={onPress}
    >
      <Image
        source={{ uri: track.artwork }}
        style={styles.artwork}
        contentFit="cover"
      />
      <View style={styles.songInfo}>
        <Text
          variant="subtitle"
          style={[styles.title, isActive && styles.activeText]}
          numberOfLines={1}
        >
          {track.title}
        </Text>
        <Text
          variant="caption"
          style={[styles.artist, isActive && styles.activeText]}
          numberOfLines={1}
        >
          {track.artist}
        </Text>
      </View>
      <Text
        variant="caption"
        style={[styles.duration, isActive && styles.activeText]}
        numberOfLines={1}
      >
        {track.duration}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  artwork: {
    width: 56,
    height: 56,
    borderRadius: 4,
  },
  songInfo: {
    flex: 1,
  },
  title: {
    marginBottom: 4,
  },
  artist: {
    opacity: 0.7,
  },
  duration: {
    opacity: 0.7,
    marginRight: 8,
  },
  activeTrack: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  activeText: {
    opacity: 1,
    color: '#0A84FF',
  },
});