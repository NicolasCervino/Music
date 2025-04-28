import { TabRoutes } from '@/constants';
import { useTheme } from '@/src/theme';
import { Pressable, ScrollView, Text, View } from 'react-native';

const tabs = [
   { id: TabRoutes.HOME, title: 'For You' },
   { id: TabRoutes.ARTISTS, title: 'Artists' },
   { id: TabRoutes.ALBUMS, title: 'Albums' },
   { id: TabRoutes.PLAYLISTS, title: 'Playlists' },
];

type TabBarProps = {
   activeTab: TabRoutes;
   onTabPress: (tabId: TabRoutes) => void;
};

export function TabBar({ activeTab, onTabPress }: TabBarProps) {
   const { theme } = useTheme();

   const activeTabColor = theme.dark ? '#FFFFFF' : theme.colors.primary;
   const activeTabTextColor = theme.dark ? '#000000' : '#FFFFFF';

   return (
      <View>
         <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
               paddingHorizontal: 16,
               paddingTop: 20,
            }}
            contentContainerStyle={{
               gap: 8,
               alignItems: 'center',
               height: 36,
            }}
         >
            {tabs.map(tab => (
               <Pressable
                  key={tab.id}
                  onPress={() => onTabPress(tab.id)}
                  style={{
                     backgroundColor: activeTab === tab.id ? activeTabColor : '#2A2A2A',
                     borderRadius: 16,
                     paddingHorizontal: 12,
                     paddingVertical: 4,
                     height: 28,
                     justifyContent: 'center',
                  }}
               >
                  <Text
                     style={{
                        color: activeTab === tab.id ? activeTabTextColor : '#FFFFFF',
                        fontSize: 12,
                        fontWeight: activeTab === tab.id ? '500' : '400',
                        lineHeight: 16,
                     }}
                  >
                     {tab.title}
                  </Text>
               </Pressable>
            ))}
         </ScrollView>
      </View>
   );
}
