import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export const useModalAnimation = (isVisible: boolean) => {
   const slideAnim = useRef(new Animated.Value(2000)).current;
   const fadeAnim = useRef(new Animated.Value(0)).current;

   useEffect(() => {
      if (isVisible) {
         Animated.parallel([
            Animated.timing(slideAnim, {
               toValue: 0,
               duration: 300,
               useNativeDriver: true,
            }),

            Animated.timing(fadeAnim, {
               toValue: 1,
               duration: 250,
               useNativeDriver: true,
            }),
         ]).start();
      } else {
         slideAnim.setValue(2000);
         fadeAnim.setValue(0);
      }
   }, [isVisible, slideAnim, fadeAnim]);

   return { slideAnim, fadeAnim };
};
