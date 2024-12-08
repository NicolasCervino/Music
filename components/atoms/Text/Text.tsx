import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { useTheme } from '@/theme';

export interface TextProps extends RNTextProps {
  variant?: 'body' | 'heading' | 'subtitle' | 'caption';
}

export function Text({ style, variant = 'body', ...props }: TextProps) {
  const { theme } = useTheme();

  const variantStyles = {
    body: {
      fontSize: 16,
      lineHeight: 24,
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      lineHeight: 32,
    },
    subtitle: {
      fontSize: 18,
      lineHeight: 27,
    },
    caption: {
      fontSize: 14,
      lineHeight: 21,
    },
  };

  return (
    <RNText
      style={[
        { color: theme.colors.text },
        variantStyles[variant],
        style,
      ]}
      {...props}
    />
  );
} 