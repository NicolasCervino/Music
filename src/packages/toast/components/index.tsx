import { useTheme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { ToastType } from '../models';

const toastConfigs = {
   success: {
      icon: 'checkmark-circle',
      color: '#4CD964',
   },
   error: {
      icon: 'close-circle',
      color: '#FF3B30',
   },
   info: {
      icon: 'information-circle',
      color: '#007AFF',
   },
};

interface ToastProps {
   message: string;
   type: ToastType;
   fadeAnim: Animated.Value;
}

export const Toast: React.FC<ToastProps> = ({ message, type, fadeAnim }) => {
   const { theme } = useTheme();
   const config = toastConfigs[type];

   return (
      <Animated.View
         style={[
            styles.container,
            {
               backgroundColor: theme.colors.card,
               opacity: fadeAnim,
               transform: [
                  {
                     translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                     }),
                  },
               ],
            },
         ]}
      >
         <View style={styles.content}>
            <View style={[styles.iconContainer, { backgroundColor: config.color + '20' }]}>
               <Ionicons name={config.icon as any} size={20} color={config.color} />
            </View>
            <Text style={[styles.message, { color: theme.colors.text }]}>{message}</Text>
         </View>
      </Animated.View>
   );
};

// Styles for the Toast component
const styles = StyleSheet.create({
   container: {
      position: 'absolute',
      bottom: 80,
      left: 16,
      right: 16,
      borderRadius: 8,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
      zIndex: 9999,
   },
   content: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   iconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
   },
   message: {
      flex: 1,
      fontSize: 14,
      fontWeight: '500',
   },
});
