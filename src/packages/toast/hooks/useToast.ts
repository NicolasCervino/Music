import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { ToastData } from '../models';

export const useToast = () => {
   const [visible, setVisible] = useState(false);
   const [toastData, setToastData] = useState<ToastData>({
      message: '',
      type: 'info',
      duration: 3000,
   });

   const fadeAnim = useRef(new Animated.Value(0)).current;
   const timeoutRef = useRef<NodeJS.Timeout | null>(null);

   const showToast = useCallback(
      (data: ToastData) => {
         // Cancel any existing timeout
         if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
         }

         setToastData(data);
         setVisible(true);

         // Animate toast in
         Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
         }).start();

         // Set timeout to hide toast
         const duration = data.duration || 3000;
         timeoutRef.current = setTimeout(() => {
            hideToast();
         }, duration);
      },
      [fadeAnim]
   );

   const hideToast = useCallback(() => {
      // Animate toast out
      Animated.timing(fadeAnim, {
         toValue: 0,
         duration: 250,
         useNativeDriver: true,
      }).start(() => {
         setVisible(false);
      });

      if (timeoutRef.current) {
         clearTimeout(timeoutRef.current);
         timeoutRef.current = null;
      }
   }, [fadeAnim]);

   useEffect(() => {
      return () => {
         if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
         }
      };
   }, []);

   return { visible, toastData, fadeAnim, showToast, hideToast };
};
