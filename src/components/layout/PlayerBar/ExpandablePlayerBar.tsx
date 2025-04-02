import { PLAYER_BAR_HEIGHT } from '@/constants/dimensions';
import { usePlayer } from '@/packages/MusicPlayer/hooks/usePlayer';
import { useTheme } from "@/theme";
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useCallback, useRef, useState } from 'react';
import { View } from 'react-native';
import PlayerTransition from "./components/PlayerTransition";
import { styles } from "./ExpandableBarStyle";
import { usePlayerBarAnimation } from "./hooks/usePlayerBarAnimation";

export function ExpandablePlayerBar() {
  const { theme } = useTheme();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { artworkColor, isPlayerReady, setIsExpanded, currentTrack, isExpanded } = usePlayer();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const {
    animatedPosition,
    isAtInitialPos,
    progress,
    animatedBackgroundStyle,
  } = usePlayerBarAnimation(artworkColor, hasUserInteracted, theme.colors.background);

  const snapPoints = [PLAYER_BAR_HEIGHT, '100%'];

  const handleSheetChanges = useCallback((index: number) => {
    setCurrentIndex(index);
    setHasUserInteracted(true);
    setIsExpanded(index === 1);
  }, [setIsExpanded]);

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
        <BottomSheetView style={[styles.contentContainer, { backgroundColor: theme.colors.background }]}>
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