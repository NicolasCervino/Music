export const COLORS = {
   // Ocean Breeze Theme
   oceanBreeze: {
      light: {
         primary: '#00B4D8', // Vibrant cyan
         background: '#FFFFFF',
         card: '#F2F2F7',
         text: '#000000',
         accent: '#00B4D8',
      },
      dark: {
         primary: '#48CAE4', // Bright cyan
         background: '#121212',
         card: '#1C1C1E',
         text: '#FFFFFF',
         accent: '#48CAE4',
      },
   },

   // Sunset Vibes Theme
   sunsetVibes: {
      light: {
         primary: '#FF6B6B', // Coral red
         background: '#FFFFFF',
         card: '#F2F2F7',
         text: '#000000',
         accent: '#FF6B6B',
      },
      dark: {
         primary: '#FF8787', // Soft coral
         background: '#121212',
         card: '#1C1C1E',
         text: '#FFFFFF',
         accent: '#FF8787',
      },
   },

   // Electric Purple Theme
   electricPurple: {
      light: {
         primary: '#9B5DE5', // Bright purple
         background: '#FFFFFF',
         card: '#F2F2F7',
         text: '#000000',
         accent: '#9B5DE5',
      },
      dark: {
         primary: '#B185DB', // Soft purple
         background: '#121212',
         card: '#1C1C1E',
         text: '#FFFFFF',
         accent: '#B185DB',
      },
   },

   // Mint Fresh Theme
   mintFresh: {
      light: {
         primary: '#00BFA6', // Fresh mint
         background: '#FFFFFF',
         card: '#F2F2F7',
         text: '#000000',
         accent: '#00BFA6',
      },
      dark: {
         primary: '#2EC4B6', // Bright mint
         background: '#121212',
         card: '#1C1C1E',
         text: '#FFFFFF',
         accent: '#2EC4B6',
      },
   },

   // Golden Hour Theme
   goldenHour: {
      light: {
         primary: '#ECE034',
         background: '#FFFFFF',
         card: '#F2F2F7',
         text: '#000000',
         accent: '#D4C300',
      },
      dark: {
         primary: '#ECE034',
         background: '#121212',
         card: '#1C1C1E',
         text: '#FFFFFF',
         accent: '#BBAE00',
      },
   },
   darkRed: {
      light: {
         primary: '#B82838',
         background: '#FFFFFF',
         card: '#F2F2F7',
         text: '#000000',
         accent: '#B82838',
      },
      dark: {
         primary: '#B82838',
         background: '#121212',
         card: '#1C1C1E',
         text: '#FFFFFF',
         accent: '#B82838',
      },
   },
} as const;

export type ThemeVariant = keyof typeof COLORS;
export type ColorScheme = 'light' | 'dark';
export type ColorKey = keyof typeof COLORS.oceanBreeze.light;
export type ThemeColors = Record<ColorKey, string>;
