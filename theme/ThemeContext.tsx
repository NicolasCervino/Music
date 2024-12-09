import { createContext, useEffect, useState } from 'react';
import { COLORS } from '@/constants';
import { useColorScheme } from 'react-native';
import { ThemeColors } from '@/constants/Colors';

type Theme = {
  dark: boolean;
  colors: ThemeColors;
};

const lightTheme: Theme = {
  dark: false,
  colors: COLORS.light,
};

const darkTheme: Theme = {
  dark: true,
  colors: COLORS.dark,
};

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(colorScheme === 'dark' ? darkTheme : lightTheme);

  useEffect(() => {
    setTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
  }, [colorScheme]);

  const toggleTheme = () => {
    setTheme(theme.dark ? lightTheme : darkTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

