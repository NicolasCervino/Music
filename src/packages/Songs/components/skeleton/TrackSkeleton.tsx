import { useTheme } from '@/src/theme';
import React from 'react';
import { Animated, View, ViewStyle } from 'react-native';
import { useShimmerAnimation } from './useShimmerAnimation';

export const TrackSkeleton = React.memo(() => {
   const { theme } = useTheme();
   const shimmerValue = useShimmerAnimation();

   const translateX = shimmerValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-300, 300],
   });

   const shimmerStyle: ViewStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.text,
      opacity: 0.2,
      transform: [{ translateX }],
   };

   return (
      <View
         style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
            paddingHorizontal: 16,
            gap: 12,
            height: 76,
            overflow: 'hidden',
         }}
      >
         <View
            style={{
               width: 56,
               height: 56,
               borderRadius: 4,
               overflow: 'hidden',
               position: 'relative',
               backgroundColor: theme.colors.text,
               opacity: 0.05,
            }}
         >
            <Animated.View style={shimmerStyle} />
         </View>
         <View style={{ flex: 1 }}>
            <View
               style={{
                  height: 18,
                  borderRadius: 4,
                  width: '80%',
                  marginBottom: 8,
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: theme.colors.text,
                  opacity: 0.05,
               }}
            >
               <Animated.View style={shimmerStyle} />
            </View>
            <View
               style={{
                  height: 14,
                  borderRadius: 4,
                  width: '60%',
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: theme.colors.text,
                  opacity: 0.05,
               }}
            >
               <Animated.View style={shimmerStyle} />
            </View>
         </View>
         <View
            style={{
               width: 35,
               height: 14,
               borderRadius: 4,
               marginRight: 8,
               overflow: 'hidden',
               position: 'relative',
               backgroundColor: theme.colors.text,
               opacity: 0.05,
            }}
         >
            <Animated.View style={shimmerStyle} />
         </View>
      </View>
   );
});
