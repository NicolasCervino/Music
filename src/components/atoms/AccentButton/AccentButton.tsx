import { usePlayer } from '@/modules/player/hooks/usePlayer';
import { useTheme } from '@/theme';
import React from 'react';
import {
   Pressable,
   PressableProps,
   StyleProp,
   StyleSheet,
   TextStyle,
   ViewStyle,
} from 'react-native';
import { Text } from '../Text/Text';

interface AccentButtonProps extends PressableProps {
   title: string;
   textStyle?: StyleProp<TextStyle>;
   buttonStyle?: StyleProp<ViewStyle>;
   disabled?: boolean;
}

export const AccentButton: React.FC<AccentButtonProps> = ({
   title,
   textStyle,
   buttonStyle,
   disabled = false,
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
   },
   text: {
      color: 'white',
      fontWeight: 'bold',
   },
});
