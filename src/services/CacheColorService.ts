import AsyncStorage from '@react-native-async-storage/async-storage';

const COLOR_CACHE_KEY = '@track_colors';

export const ColorService = {
  getStoredColor: async (trackId: string): Promise<string | null> => {
    try {
      const colorsJson = await AsyncStorage.getItem(COLOR_CACHE_KEY);
      const colors = colorsJson ? JSON.parse(colorsJson) : {};
      return colors[trackId] || null;
    } catch (error) {
      console.error('Error getting stored color:', error);
      return null;
    }
  },

  storeColor: async (trackId: string, color: string): Promise<void> => {
    try {
      const colorsJson = await AsyncStorage.getItem(COLOR_CACHE_KEY);
      const colors = colorsJson ? JSON.parse(colorsJson) : {};
      colors[trackId] = color;
      await AsyncStorage.setItem(COLOR_CACHE_KEY, JSON.stringify(colors));
    } catch (error) {
      console.error('Error storing color:', error);
    }
  }
}; 