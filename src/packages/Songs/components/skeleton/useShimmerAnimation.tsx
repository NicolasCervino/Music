import { useEffect } from "react";

import { useRef } from "react";
import { Animated } from "react-native";

export const useShimmerAnimation = () => {
  const shimmerValue = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmerValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    );
    
    shimmerAnimation.start();
    
    return () => shimmerAnimation.stop();
  }, [shimmerValue]);
  
  return shimmerValue;
};