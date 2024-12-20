import HeaderLogo from '@/components/atoms/Logo/HeaderLogo';
import ExpandablePlayerBar from '@/components/layout/PlayerBar/ExpandablePlayerBar';
import TabBar from '@/components/layout/TabBar/TabBar';
import TabContent from '@/components/layout/TabBar/TabContent';
import { usePlayer } from '@/packages/MusicPlayer/hooks/usePlayer';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useTheme } from '@/theme';
import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, StatusBar, StatusBarStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Layout() {
  const [activeTab, setActiveTab] = useState('home');
  const { isPlayerReady, isExpanded, artworkColor, isVisible } = usePlayer();
  const { theme } = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    usePlayerStore.getState().loadSongs();
  }, []);

  const statusBarStyle = isExpanded && isPlayerReady
    ? 'light'
    : theme.dark
      ? 'light'
      : 'dark';

  const statusBarBackgroundColor = isExpanded && isPlayerReady
    ? artworkColor
    : theme.colors.background;

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(statusBarBackgroundColor, true);
      StatusBar.setBarStyle(statusBarStyle as StatusBarStyle);

      // Always update navigation bar color, not just when expanded
      navigation.setOptions({
        navigationBarColor: isExpanded && isPlayerReady
          ? statusBarBackgroundColor
          : theme.colors.background,
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
      <TabBar activeTab={activeTab} onTabPress={setActiveTab} />
      <TabContent activeTab={activeTab} />
      {isVisible && <ExpandablePlayerBar />}
    </SafeAreaView>
  );
}