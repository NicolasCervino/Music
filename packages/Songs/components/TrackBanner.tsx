import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/atoms';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import { Track } from '@/entities';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme';
import { useEffect } from 'react';

type TrackBannerProps = {
  track: Track;
  isActive: boolean;
  onPress: () => void;
};

export function TrackBanner({ track, isActive, onPress }: TrackBannerProps) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={[styles.trackItem]}
      onPress={onPress}
    >
      {track.artwork ? (
        <Image
          source={{ uri: track.artwork }}
          style={styles.artwork}
          contentFit="cover"
        />
      ) : (
        <View style={[styles.artwork, styles.placeholderArtwork]}>
          <Ionicons
            name="musical-note"
            size={24}
            color={isActive ? theme.colors.primary : 'rgba(255, 255, 255, 0.7)'}
          />
        </View>
      )}
      <View style={styles.songInfo}>
        <Text
          variant="subtitle"
          style={[styles.title, isActive && { color: theme.colors.primary }]}
          numberOfLines={1}
        >
          {track.title}
        </Text>
        <Text
          variant="caption"
          style={[styles.artist, isActive && { color: theme.colors.primary }]}
          numberOfLines={1}
        >
          {track.artist}
        </Text>
      </View>
      <Text
        variant="caption"
        style={[styles.duration, isActive && { color: theme.colors.primary }]}
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
    paddingHorizontal: 16,
    gap: 12,
  },
  artwork: {
    width: 56,
    height: 56,
    borderRadius: 4,
  },
  placeholderArtwork: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
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
  activeText: {
    opacity: 1,
  },
});