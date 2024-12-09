import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Image } from 'expo-image'
import { Text } from '@/components/atoms'
import { View, StyleSheet } from 'react-native'
import { usePlayer } from '@/packages/MusicPlayer/hooks/usePlayer'
import { PLAYER_BAR_HEIGHT } from './constants'
import { useTheme } from '@/theme'

type MiniPlayerProps = {
  onPress: () => void;
  backgroundColor: string;
  isReady: boolean;
}
function MiniPlayer({ onPress, backgroundColor, isReady }: MiniPlayerProps) {
  const { currentTrack, handleArtworkLoad, isPlaying } = usePlayer();

  if (!currentTrack) return null;

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
          <Image
            source={{ uri: currentTrack.artwork }}
            style={styles.artwork}
            contentFit="cover"
            onLoad={handleArtworkLoad}
          />
          <View>
            <Text variant="caption" style={styles.title}>
              {currentTrack.title}
            </Text>
            <Text variant="caption" style={styles.artist}>
              {currentTrack.artist}
            </Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
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

