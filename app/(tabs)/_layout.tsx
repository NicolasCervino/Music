import HeaderLogo from '@/components/atoms/Logo/HeaderLogo';
import PlayerBar from '@/components/layout/PlayerBar/PlayerBar';
import TabBar from '@/components/layout/TabBar/TabBar';
import TabContent from '@/components/layout/TabBar/TabContent';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Layout() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HeaderLogo />
      <TabBar activeTab={activeTab} onTabPress={setActiveTab} />
      <TabContent activeTab={activeTab} />
      <PlayerBar />
    </SafeAreaView>
  );
}