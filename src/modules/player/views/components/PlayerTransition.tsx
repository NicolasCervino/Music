import { useTheme } from '@/src/theme';
import { StyleSheet, View } from 'react-native';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { ExpandedPlayerView } from './expanded-player/ExpandedPlayerView';
import { MiniPlayer } from './mini-player/MiniPlayer';

type PlayerTransitionProps = {
   progress: SharedValue<number>;
   artworkColor: string;
   isPlayerReady: boolean;
   isAtInitialPosition: SharedValue<boolean>;
   onMiniPlayerPress: () => void;
};

export function PlayerTransition({
   progress,
   artworkColor,
   isPlayerReady,
   onMiniPlayerPress,
   isAtInitialPosition,
}: PlayerTransitionProps) {
   const { theme } = useTheme();

   const miniPlayerStyle = useAnimatedStyle(() => ({
      opacity: isAtInitialPosition.value
         ? 1
         : progress.value >= 0.95
         ? 1
         : progress.value <= 0.85
         ? 0
         : (progress.value - 0.85) / (0.95 - 0.85),
      pointerEvents: isAtInitialPosition.value ? 'auto' : ('none' as const),
   }));

   const playerViewStyle = useAnimatedStyle(() => ({
      opacity: isAtInitialPosition.value
         ? 0
         : progress.value >= 0.95
         ? 0
         : progress.value <= 0.85
         ? 1
         : 1 - (progress.value - 0.85) / (0.95 - 0.85),
      pointerEvents: isAtInitialPosition.value ? 'none' : ('auto' as const),
   }));

   const backgroundColor = artworkColor === '' ? theme.colors.primary : artworkColor;

   return (
      <View style={StyleSheet.absoluteFill}>
         <Animated.View style={[StyleSheet.absoluteFill, miniPlayerStyle]}>
            <MiniPlayer
               onPress={onMiniPlayerPress}
               backgroundColor={backgroundColor}
               isReady={isPlayerReady}
            />
         </Animated.View>

         <Animated.View style={[StyleSheet.absoluteFill, playerViewStyle]}>
            <ExpandedPlayerView backgroundColor={backgroundColor} isReady={isPlayerReady} />
         </Animated.View>
      </View>
   );
}
