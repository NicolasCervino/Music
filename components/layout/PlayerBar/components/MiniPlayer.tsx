import { MarqueeText } from '@/components/atoms/MarqueeText/MarqueeText'
import { PLAYER_BAR_HEIGHT } from '@/constants/dimensions'
import { usePlayer } from '@/packages/MusicPlayer/hooks/usePlayer'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

type MiniPlayerProps = {
  onPress: () => void;
  backgroundColor: string;
  isReady: boolean;
}
function MiniPlayer({ onPress, backgroundColor, isReady }: MiniPlayerProps) {
  const {
    currentTrack,
    handleArtworkLoad,
    isPlaying,
    pauseTrack,
    resumeTrack,
    nextTrack,
    previousTrack
  } = usePlayer();

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={[
        styles.container,
        {
          backgroundColor: isReady ? backgroundColor : 'transparent',
          opacity: isReady ? 1 : 0
        }
      ]}
    >
      <View style={[styles.content]}>
        {/* Song info */}
        <View style={styles.songInfo}>
          {currentTrack?.artwork ? (
            <Image
              source={{ uri: currentTrack.artwork }}
              style={styles.artwork}
              contentFit="cover"
              onLoad={handleArtworkLoad}
            />
          ) : (
            <View style={[styles.artwork, styles.placeholderArtwork]}>
              <Ionicons
                name="musical-note"
                size={20}
                color="rgba(255, 255, 255, 0.7)"
              />
            </View>
          )}
          <View>
            <MarqueeText
              text={currentTrack?.title ?? ''}
              style={{ width: 150 }}
              textStyle={styles.title}
              variant="caption"
              speed={0.3}
              spacing={45}
            />
            <MarqueeText
              text={currentTrack?.artist ?? ''}
              style={{ width: 150 }}
              textStyle={styles.artist}
              variant="caption"
              speed={0.3}
              spacing={45}
            />
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity onPress={previousTrack}>
            <Ionicons name="play-skip-back" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePlayPause}>
            <Ionicons name={isPlaying ? "pause" : "play"} size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={nextTrack}>
            <Ionicons name="play-skip-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>

      </View>
    </TouchableOpacity >
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: PLAYER_BAR_HEIGHT,
    borderRadius: 50,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Add subtle dark overlay
    borderRadius: 50,
  },
  songInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  artwork: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  placeholderArtwork: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  artist: {
    color: '#FFFFFF',
    opacity: 0.8,
  },
  controls: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
});

export default MiniPlayer

