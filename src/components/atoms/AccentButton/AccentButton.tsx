import { usePlayer } from '@/modules/player/hooks/usePlayer';
import { useTheme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
   Pressable,
   PressableProps,
   StyleProp,
   StyleSheet,
   TextStyle,
   View,
   ViewStyle,
} from 'react-native';
import { Text } from '../Text/Text';

interface AccentButtonProps extends PressableProps {
   title: string;
   textStyle?: StyleProp<TextStyle>;
   buttonStyle?: StyleProp<ViewStyle>;
   disabled?: boolean;
   iconName?: string;
}

export const AccentButton: React.FC<AccentButtonProps> = ({
   title,
   textStyle,
   buttonStyle,
   disabled = false,
   iconName,
   ...rest
}) => {
   const { theme } = useTheme();
   const { artworkColor } = usePlayer();
   const backgroundColor = artworkColor === '' ? theme.colors.primary : artworkColor;

   return (
      <Pressable
         style={[
            styles.button,
            {
               backgroundColor: disabled ? backgroundColor + 'CC' : backgroundColor,
            },
            buttonStyle,
         ]}
         disabled={disabled}
         {...rest}
      >
         {iconName && (
            <View style={styles.iconContainer}>
               <Ionicons name={iconName as any} size={18} color="white" />
            </View>
         )}
         <Text style={[styles.text, textStyle]}>{title}</Text>
      </Pressable>
   );
};

const styles = StyleSheet.create({
   button: {
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
   },
   text: {
      color: 'white',
      fontWeight: 'bold',
   },
   iconContainer: {
      marginRight: 8,
   },
});
