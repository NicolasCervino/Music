import { useTheme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

type ShufflePlayProps = {
   onPress?: () => void;
   disabled?: boolean;
   size?: number;
};

export function ShufflePlay({ onPress, disabled = false, size = 20 }: ShufflePlayProps) {
   const { theme } = useTheme();

   const backgroundColor = theme.dark ? '#e0e0e0' : 'black';
   const iconColor = theme.dark ? 'black' : 'white';
   const opacity = disabled ? 0.3 : 1;

   return (
      <Pressable
         onPress={disabled ? undefined : onPress}
         style={({ pressed }) => [
            styles.button,
            {
               backgroundColor,
               opacity: pressed ? 0.4 : 1,
            },
         ]}
      >
         <Ionicons name="shuffle" size={size} color={iconColor} style={{ opacity }} />
      </Pressable>
   );
}

const styles = StyleSheet.create({
   button: {
      padding: 8,
      borderRadius: 12,
   },
});
