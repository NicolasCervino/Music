export const COLORS = {
  light: {
    primary: '#007AFF',
    background: '#FFFFFF',
    card: '#F2F2F2',
    text: '#000000',
    accent: '#007AFF',
  },
  dark: {
    primary: '#0A84FF',
    background: '#121212',
    card: '#1C1C1E',
    text: '#FFFFFF',
    accent: '#0A84FF',
  },
} as const;

export type ColorScheme = keyof typeof COLORS;
export type ColorKey = keyof typeof COLORS.light;
export type ThemeColors = Record<ColorKey, string>;