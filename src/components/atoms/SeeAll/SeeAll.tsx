import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '../Text/Text';
import { useTheme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';

type SeeAllProps = {
  onPress?: () => void;
};

export function SeeAll({ onPress }: SeeAllProps) {
  const { theme } = useTheme();

  return (
    <Pressable onPress={onPress}>
      <View style={styles.container}>
        <Text
          variant="caption"
          style={{ color: theme.colors.text, opacity: 0.6 }}
        >
          See all
        </Text>
        <Ionicons
          name="chevron-forward"
          size={16}
          color={theme.colors.text}
          style={{ opacity: 0.6 }}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  text: {
    fontSize: 14,
  },
});