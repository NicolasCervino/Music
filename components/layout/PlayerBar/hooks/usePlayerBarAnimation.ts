import { useAnimatedReaction, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useRef } from 'react';
import { PLAYER_BAR_HEIGHT } from '../constants';

export function usePlayerBarAnimation(
  artworkColor: string,
  hasUserInteracted: boolean,
  themeBackgroundColor: string
) {
  const animatedPosition = useSharedValue(0);
  const initialPositionRef = useRef<number | null>(null);
  const lastPositionRef = useRef<number>(0);
  const isAtInitialPos = useSharedValue(true);
  const progress = useSharedValue(0);
  const backgroundColorValue = useSharedValue<string>(themeBackgroundColor);

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColorValue.value,
  }));

  useAnimatedReaction(
    () => animatedPosition.value,
    (currentPosition) => {
      if (initialPositionRef.current === null) {
        initialPositionRef.current = currentPosition;
        lastPositionRef.current = currentPosition;
        return;
      }

      if (!hasUserInteracted) {
        backgroundColorValue.value = themeBackgroundColor;
        return;
      }

      const windowHeight = global.window?.innerHeight ?? 800;
      const maxDistance = windowHeight - PLAYER_BAR_HEIGHT;

      const currentProgress = Math.max(0, Math.min(1,
        (currentPosition - PLAYER_BAR_HEIGHT) / maxDistance
      ));
      progress.value = currentProgress;

      const isAtInitialPosition = Math.abs(currentPosition - initialPositionRef.current) < 1 || initialPositionRef.current === 0;
      isAtInitialPos.value = isAtInitialPosition;

      backgroundColorValue.value = isAtInitialPosition ? themeBackgroundColor : artworkColor;

      lastPositionRef.current = currentPosition;
    },
    [artworkColor, hasUserInteracted, themeBackgroundColor]
  );

  return {
    animatedPosition,
    isAtInitialPos,
    progress,
    animatedBackgroundStyle,
  };
}