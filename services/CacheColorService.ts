import AsyncStorage from '@react-native-async-storage/async-storage';

export class ColorCacheService {
  private static COLOR_CACHE_KEY = '@track_colors';

  private static simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    // Convert to positive hex string and take first 8 characters
    return Math.abs(hash).toString(16).substring(0, 8);
  }

    static async getStoredColor(trackId: string, uri?: string): Promise<string | null> {
    try {
      const key = trackId || this.simpleHash(uri || '');
      const colorsJson = await AsyncStorage.getItem(this.COLOR_CACHE_KEY);
      const colors = colorsJson ? JSON.parse(colorsJson) : {};
      return colors[key] || null;
    } catch (error) {
      console.error('Error getting stored color:', error);
      return null;
    }
  }

  static async storeColor(trackId: string, color: string, uri?: string): Promise<void> {
    try {
      const key = trackId || this.simpleHash(uri || '');
      const colorsJson = await AsyncStorage.getItem(this.COLOR_CACHE_KEY);
      const colors = colorsJson ? JSON.parse(colorsJson) : {};
      colors[key] = color;
      await AsyncStorage.setItem(this.COLOR_CACHE_KEY, JSON.stringify(colors));
    } catch (error) {
      console.error('Error storing color:', error);
    }
  }
}