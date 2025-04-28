import HeaderLogo from '@/components/atoms/Logo/HeaderLogo';
import { TabBar } from '@/components/layout';
import { TabContent } from '@/components/layout/tabBar/TabContent';
import { TabRoutes } from '@/constants';
import { useInitializePlayer, usePlayer } from '@/modules/player';
import { useMediaLibraryPermission } from '@/packages';
import { useTheme } from '@/theme';
import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, StatusBar, StatusBarStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MainTabs() {
   const [activeTab, setActiveTab] = useState<TabRoutes>(TabRoutes.HOME);
   const { isPlayerReady, isExpanded, artworkColor } = usePlayer();
   const { theme } = useTheme();
   const navigation = useNavigation();
   const initializePlayer = useInitializePlayer();

   const { checkPermissionQuery } = useMediaLibraryPermission();

   useEffect(() => {
      const permissionsGranted = checkPermissionQuery.data?.granted;
      if (
         checkPermissionQuery.isSuccess &&
         permissionsGranted &&
         !initializePlayer.isSuccess &&
         !initializePlayer.isPending
      ) {
         initializePlayer.mutate();
      }
   }, [
      checkPermissionQuery.isSuccess,
      checkPermissionQuery.data?.granted,
      initializePlayer.isSuccess,
      initializePlayer.isPending,
      initializePlayer.mutate,
   ]);

   const statusBarStyle =
      isExpanded && isPlayerReady ? 'light' : !theme.dark ? 'dark-content' : 'light-content';

   const statusBarBackgroundColor =
      isExpanded && isPlayerReady ? artworkColor : theme.colors.background;

   useEffect(() => {
      if (Platform.OS === 'android') {
         StatusBar.setBackgroundColor(statusBarBackgroundColor, true);
         StatusBar.setBarStyle(statusBarStyle as StatusBarStyle);

         navigation.setOptions({
            navigationBarColor:
               isExpanded && isPlayerReady ? statusBarBackgroundColor : theme.colors.background,
         });
      }
   }, [isExpanded, isPlayerReady, statusBarBackgroundColor, statusBarStyle]);

   return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
         <StatusBar
            backgroundColor={statusBarBackgroundColor}
            barStyle={statusBarStyle as StatusBarStyle}
            translucent
         />
         <HeaderLogo />
         <TabBar activeTab={activeTab} onTabPress={(tabId: TabRoutes) => setActiveTab(tabId)} />
         <TabContent activeTab={activeTab} />
      </SafeAreaView>
   );
}
