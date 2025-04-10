import { ExpandablePlayerBarView, usePlayer } from '@/features/player';
import { ThemeProvider as CustomThemeProvider, useTheme } from '@/theme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { queryClient } from '../clients/queryClient';
import { SplashScreen, useSplashScreen } from '../packages/splashscreen';
import { PlayerService } from '../services/TrackPlayerService';
import { MusicService } from '../services/music-metadata/MusicMetadataService';

export default function RootLayout() {
   const [loaded] = useFonts({
      SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
   });

   const { appIsReady } = useSplashScreen({
      prepare: async () => {
         try {
            await PlayerService.setupPlayer();
            await MusicService.initialize();
         } catch (error) {
            console.error('Error initializing app:', error);
         }
      },
      delay: 600,
   });

   if (!loaded || !appIsReady) {
      return <SplashScreen />;
   }

   return (
      <QueryClientProvider client={queryClient}>
         <CustomThemeProvider>
            <NavigationWrapper />
         </CustomThemeProvider>
      </QueryClientProvider>
   );
}

function NavigationWrapper() {
   const { theme } = useTheme();
   const { isVisible } = usePlayer();

   return (
      <ThemeProvider value={theme.dark ? DarkTheme : DefaultTheme}>
         <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }}>
               <Stack.Screen name="index" />
               <Stack.Screen name="artist/[id]" options={{ headerShown: false }} />
               <Stack.Screen name="album/[id]" options={{ headerShown: false }} />
            </Stack>
            {isVisible && <ExpandablePlayerBarView />}
         </GestureHandlerRootView>
      </ThemeProvider>
   );
}
