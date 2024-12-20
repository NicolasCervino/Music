import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from '@/components/atoms';
import Animated, { useAnimatedStyle, useSharedValue, runOnJS, withTiming, useAnimatedReaction } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import { useProgress } from '@/packages/MusicPlayer/hooks/useProgress';
import { usePlayer } from '../../hooks/usePlayer';
import TrackPlayer from 'react-native-track-player';

const SLIDER_WIDTH = Dimensions.get('window').width - 40;

export function ProgressSlider() {
  const progress = useProgress();
  const { currentTrack } = usePlayer();
  const sliderPosition = useSharedValue(0);
  const shouldAnimate = useSharedValue(true);
  const isDragging = useSharedValue(false);

  useEffect(() => {
    // When track changes, disable animation temporarily
    shouldAnimate.value = false;
    sliderPosition.value = 0;
    // Re-enable animation on next frame
    requestAnimationFrame(() => {
      shouldAnimate.value = true;
    });
  }, [currentTrack?.id]);

  const sliderGesture = Gesture.Pan()
    .onBegin(() => {
      isDragging.value = true;
    })
    .onUpdate((e) => {
      const newPosition = Math.max(0, Math.min(e.absoluteX - 20, SLIDER_WIDTH));
      sliderPosition.value = newPosition;
    })
    .onEnd(() => {
      'worklet';
      isDragging.value = false;
      const percentage = sliderPosition.value / SLIDER_WIDTH;
      runOnJS(progress.seekTo)(percentage * progress.duration);
    })
    .simultaneousWithExternalGesture(Gesture.Pan())
    .shouldCancelWhenOutside(false);

  const tapGesture = Gesture.Tap()
    .onEnd((e) => {
      'worklet';
      const newPosition = Math.max(0, Math.min(e.absoluteX - 20, SLIDER_WIDTH));
      sliderPosition.value = newPosition;
      const percentage = newPosition / SLIDER_WIDTH;
      runOnJS(progress.seekTo)(percentage * progress.duration);
    })
    .simultaneousWithExternalGesture(Gesture.Pan());

  const composedGestures = Gesture.Simultaneous(sliderGesture, tapGesture);

  useEffect(() => {
    if (!isDragging.value) {
      const percentage = progress.position / progress.duration;
      const newPosition = percentage * SLIDER_WIDTH;
      if (shouldAnimate.value) {
        sliderPosition.value = withTiming(newPosition, { duration: 0 });
      } else {
        sliderPosition.value = newPosition;
      }
    }
  }, [progress.position, progress.duration]);

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: sliderPosition.value,
      // Disable native driver animations when shouldAnimate is false
      transform: [{ scale: shouldAnimate.value ? 1 : 1 }],
    };
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: sliderPosition.value },
      { scale: shouldAnimate.value ? 1 : 1 }
    ],
  }));

  return (
    <View style={styles.progressContainer}>
      <GestureDetector gesture={composedGestures}>
        <View style={styles.hitSlop}>
          <View style={styles.progressBar}>
            <View style={styles.progressBackground} />
            <Animated.View style={[styles.progressFill, progressStyle]} />
            <Animated.View style={[styles.progressKnob, animatedStyle]} />
          </View>
        </View>
      </GestureDetector>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{progress.formattedPosition}</Text>
        <Text style={styles.timeText}>{progress.formattedDuration}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    width: SLIDER_WIDTH,
    marginBottom: 32,
  },
  hitSlop: {
    height: 30,
    justifyContent: 'center',
  },
  progressBar: {
    width: SLIDER_WIDTH,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    position: 'relative',
  },
  progressBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  progressKnob: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    top: -4,
    marginLeft: -6,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.7,
  },
});