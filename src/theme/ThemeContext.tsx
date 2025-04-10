import { COLORS } from '@/constants';
import { ColorScheme, ThemeColors, ThemeVariant } from '@/constants/Colors';
import { createContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

type Theme = {
   dark: boolean;
   colors: ThemeColors;
   variant: ThemeVariant;
};

type ThemeContextType = {
   theme: Theme;
   toggleTheme: () => void;
   setThemeVariant: (variant: ThemeVariant) => void;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
   const colorScheme = useColorScheme();
   const [currentVariant, setCurrentVariant] = useState<ThemeVariant>('sunsetVibes');

   const getTheme = (scheme: ColorScheme, variant: ThemeVariant): Theme => ({
      dark: scheme === 'dark',
      colors: COLORS[variant][scheme],
      variant,
   });

   const [theme, setTheme] = useState<Theme>(getTheme(colorScheme ?? 'light', currentVariant));

   useEffect(() => {
      setTheme(getTheme(colorScheme ?? 'light', currentVariant));
   }, [colorScheme, currentVariant]);

   const toggleTheme = () => {
      setTheme(getTheme(theme.dark ? 'light' : 'dark', currentVariant));
   };

   const setThemeVariant = (variant: ThemeVariant) => {
      setCurrentVariant(variant);
   };

   return (
      <ThemeContext.Provider value={{ theme, toggleTheme, setThemeVariant }}>
         {children}
      </ThemeContext.Provider>
   );
}
