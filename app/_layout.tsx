import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { ThemeProvider as CustomThemeProvider, useTheme } from '@/theme';
import { PlayerProvider } from '@/packages/MusicPlayer/context/PlayerContext';
import { usePlayer } from '@/packages/MusicPlayer/hooks/usePlayer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <CustomThemeProvider>
      <NavigationWrapper />
    </CustomThemeProvider>
  );
}

function NavigationWrapper() {
  const { theme } = useTheme();

  return (
    <ThemeProvider value={theme.dark ? DarkTheme : DefaultTheme}>
      <PlayerProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
          <StatusBar style={theme.dark ? 'light' : 'dark'} />
        </GestureHandlerRootView>
      </PlayerProvider>
    </ThemeProvider>
  );
}