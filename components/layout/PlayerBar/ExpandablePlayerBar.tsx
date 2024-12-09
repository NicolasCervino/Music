import { runOnJS, useAnimatedReaction, useSharedValue } from "react-native-reanimated";
import { StyleSheet, View } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { usePlayer } from '@/packages/MusicPlayer/hooks/usePlayer';
import MiniPlayer from './MiniPlayer';
import PlayerView from '@/views/Player/PlayerView';
import { PLAYER_BAR_HEIGHT } from './constants';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function ExpandablePlayerBar() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { artworkColor, isPlayerReady, isExpanded, setIsExpanded } = usePlayer();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [background, setBackground] = useState('transparent');
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const animatedPosition = useSharedValue(0);

  // Snap points for the bottom sheet (collapsed and expanded states)
  const snapPoints = [PLAYER_BAR_HEIGHT, '100%'];

  const handleSheetChanges = useCallback((index: number) => {
    setCurrentIndex(index);
    setHasUserInteracted(true);
    setIsExpanded(index === 1);
  }, [setIsExpanded]);

  const initialPositionRef = useRef<number | null>(null);
  const lastPositionRef = useRef<number>(0);

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
        runOnJS(setBackground)('transparent');
        return;
      }

      // Check if we're at the initial position
      const isAtInitialPosition = Math.abs(currentPosition - initialPositionRef.current) < 1 || initialPositionRef.current === 0;

      if (isAtInitialPosition) {
        runOnJS(setBackground)('transparent');
      } else {
        runOnJS(setBackground)(artworkColor);
      }

      lastPositionRef.current = currentPosition;
    },
    [artworkColor, hasUserInteracted]
  );

  useEffect(() => {
    console.log('Background state changed to:', background);
  }, [background]);

  return (
    <View style={styles.container}>

      <BottomSheet
        ref={bottomSheetRef}
        index={currentIndex}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        animatedPosition={animatedPosition}
        backgroundStyle={{
          backgroundColor: background,
        }}
        handleComponent={null}
        handleIndicatorStyle={{
          backgroundColor: 'white',
        }}
        style={styles.bottomSheet}
        enablePanDownToClose={false}
        enableOverDrag={false}
      >
        <BottomSheetView style={styles.contentContainer}>
          {currentIndex === 0 ? (
            <MiniPlayer
              onPress={() => bottomSheetRef.current?.snapToIndex(1)}
              backgroundColor={artworkColor}
              isReady={isPlayerReady}
            />
          ) : (
            <PlayerView
              backgroundColor={artworkColor}
              isReady={isPlayerReady}
            />
          )}
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