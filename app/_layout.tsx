import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { ThemeProvider as CustomThemeProvider, useTheme } from '@/theme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TrackPlayerService } from '@/services/TrackPlayerService';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    let mounted = true;

    const initializePlayer = async () => {
      try {
        await TrackPlayerService.setupPlayer();
      } catch (error) {
        console.error('Error initializing player:', error);
      }
    };

    if (mounted) {
      initializePlayer();
    }

    return () => {
      mounted = false;
    };
  }, []);

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
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}