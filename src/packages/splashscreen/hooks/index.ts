import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

SplashScreen.preventAutoHideAsync().catch();

interface UseSplashScreenOptions {
   delay?: number;
   prepare?: () => Promise<void>;
}

export const useSplashScreen = ({
   delay = 300,
   prepare: customPrepare,
}: UseSplashScreenOptions = {}) => {
   const [appIsReady, setAppIsReady] = useState(false);

   const prepareApp = async () => {
      try {
         if (customPrepare) {
            await customPrepare();
         }
         if (delay > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
         }
         setAppIsReady(true);
      } catch {}
   };

   const hideSplashScreen = async () => {
      try {
         await SplashScreen.hideAsync();
      } catch {}
   };

   useEffect(() => {
      prepareApp();
   }, []);

   useEffect(() => {
      if (appIsReady) {
         hideSplashScreen();
      }
   }, [appIsReady]);

   return {
      appIsReady,
   };
};
