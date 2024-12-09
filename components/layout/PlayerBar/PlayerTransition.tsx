import { StyleSheet, View } from 'react-native';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import MiniPlayer from './MiniPlayer';
import PlayerView from '@/views/Player/PlayerView';
import { useEffect } from 'react';

type PlayerTransitionProps = {
  progress: SharedValue<number>;
  artworkColor: string;
  isPlayerReady: boolean;
  isAtInitialPosition: SharedValue<boolean>;
  onMiniPlayerPress: () => void;
}

export default function PlayerTransition({
  progress,
  artworkColor,
  isPlayerReady,
  onMiniPlayerPress,
  isAtInitialPosition,
}: PlayerTransitionProps) {

  const miniPlayerStyle = useAnimatedStyle(() => ({
    opacity: isAtInitialPosition.value ? 1 :
      progress.value >= 0.95 ? 1 :
        progress.value <= 0.85 ? 0 :
          (progress.value - 0.85) / (0.95 - 0.85),
    pointerEvents: isAtInitialPosition.value ? 'auto' : 'none' as const,
  }));

  const playerViewStyle = useAnimatedStyle(() => ({
    opacity: isAtInitialPosition.value ? 0 :
      progress.value >= 0.95 ? 0 :
        progress.value <= 0.85 ? 1 :
          1 - ((progress.value - 0.85) / (0.95 - 0.85)),
    pointerEvents: isAtInitialPosition.value ? 'none' : 'auto' as const,
  }));

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View
        style={[StyleSheet.absoluteFill, miniPlayerStyle]}
      >
        <MiniPlayer
          onPress={onMiniPlayerPress}
          backgroundColor={artworkColor}
          isReady={isPlayerReady}
        />
      </Animated.View>

      <Animated.View
        style={[StyleSheet.absoluteFill, playerViewStyle]}
      >
        <PlayerView
          backgroundColor={artworkColor}
          isReady={isPlayerReady}
        />
      </Animated.View>
    </View>
  );
}