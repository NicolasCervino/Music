import { PLAYER_BAR_HEIGHT } from '@/constants/dimensions';
import { useTheme } from '@/theme';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useCallback, useRef, useState } from 'react';
import { View } from 'react-native';
import { usePlayer } from '../hooks/usePlayer';
import { PlayerTransition } from './components/PlayerTransition';
import { usePlayerBarAnimation } from './hooks/usePlayerBarAnimation';

export function ExpandablePlayerBarView() {
   const { theme } = useTheme();
   const bottomSheetRef = useRef<BottomSheet>(null);
   const { artworkColor, isPlayerReady, setIsExpanded, currentTrack, isExpanded } = usePlayer();
   const [currentIndex, setCurrentIndex] = useState(0);
   const [hasUserInteracted, setHasUserInteracted] = useState(false);

   const { animatedPosition, isAtInitialPos, progress, animatedBackgroundStyle } =
      usePlayerBarAnimation(artworkColor, hasUserInteracted, theme.colors.background);

   const snapPoints = [PLAYER_BAR_HEIGHT, '100%'];

   const handleSheetChanges = useCallback(
      (index: number) => {
         setCurrentIndex(index);
         setHasUserInteracted(true);
         setIsExpanded(index === 1);
      },
      [setIsExpanded]
   );

   return (
      <View
         style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '100%',
            pointerEvents: 'box-none',
         }}
      >
         <BottomSheet
            ref={bottomSheetRef}
            index={currentIndex}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            animatedPosition={animatedPosition}
            backgroundStyle={animatedBackgroundStyle}
            handleComponent={null}
            style={{
               shadowColor: '#000',
               shadowOffset: {
                  width: 0,
                  height: -4,
               },
               shadowOpacity: 0.25,
               shadowRadius: 4,
               elevation: 5,
            }}
            enablePanDownToClose={false}
            enableOverDrag={false}
         >
            <BottomSheetView style={{ flex: 1, backgroundColor: theme.colors.background }}>
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
