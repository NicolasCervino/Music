import { runOnJS, useAnimatedReaction, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { StyleSheet, View } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { usePlayer } from '@/packages/MusicPlayer/hooks/usePlayer';
import MiniPlayer from './MiniPlayer';
import PlayerView from '@/views/Player/PlayerView';
import { PLAYER_BAR_HEIGHT } from './constants';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import PlayerTransition from "./PlayerTransition";

export default function ExpandablePlayerBar() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { artworkColor, isPlayerReady, isExpanded, setIsExpanded } = usePlayer();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const animatedPosition = useSharedValue(0);
  const initialPositionRef = useRef<number | null>(null);
  const lastPositionRef = useRef<number>(0);
  const isAtInitialPos = useSharedValue(true);
  const progress = useSharedValue(0);
  const backgroundColorValue = useSharedValue('transparent');

  // Snap points for the bottom sheet (collapsed and expanded states)
  const snapPoints = [PLAYER_BAR_HEIGHT, '100%'];

  const handleSheetChanges = useCallback((index: number) => {
    setCurrentIndex(index);
    setHasUserInteracted(true);
    setIsExpanded(index === 1);
  }, [setIsExpanded]);

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColorValue.value,
  }));

  useAnimatedReaction(
    () => animatedPosition.value,
    (currentPosition) => {
      // Initialize on first run
      if (initialPositionRef.current === null) {
        initialPositionRef.current = currentPosition;
        lastPositionRef.current = currentPosition;
        return;
      }

      // If user hasn't interacted yet, keep it transparent
      if (!hasUserInteracted) {
        backgroundColorValue.value = 'transparent';
        return;
      }

      // Get the window height for calculating the maximum distance
      const windowHeight = global.window?.innerHeight ?? 800;
      const maxDistance = windowHeight - PLAYER_BAR_HEIGHT;

      const currentProgress = Math.max(0, Math.min(1,
        (currentPosition - PLAYER_BAR_HEIGHT) / maxDistance
      ));
      progress.value = currentProgress;

      // Check if we're at the initial position
      const isAtInitialPosition = Math.abs(currentPosition - initialPositionRef.current) < 1 || initialPositionRef.current === 0;
      isAtInitialPos.value = isAtInitialPosition;

      // Update background color directly in the animation thread
      backgroundColorValue.value = isAtInitialPosition ? 'transparent' : artworkColor;

      lastPositionRef.current = currentPosition;
    },
    [artworkColor, hasUserInteracted]
  );

  return (
    <View style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        index={currentIndex}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        animatedPosition={animatedPosition}
        backgroundStyle={animatedBackgroundStyle}
        handleComponent={null}
        style={styles.bottomSheet}
        enablePanDownToClose={false}
        enableOverDrag={false}
      >
        <BottomSheetView style={styles.contentContainer}>
          <PlayerTransition
            progress={progress}
            artworkColor={artworkColor}
            isPlayerReady={isPlayerReady}
            isAtInitialPosition={isAtInitialPos}
            onMiniPlayerPress={() => bottomSheetRef.current?.snapToIndex(1)}
          />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    pointerEvents: 'box-none',
  },
  bottomSheet: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  contentContainer: {
    backgroundColor: 'transparent',
    flex: 1,
  }
});