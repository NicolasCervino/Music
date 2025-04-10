import { Pressable, ScrollView, Text, View } from 'react-native';

const tabs = [
   { id: 'home', title: 'For You' },
   { id: 'artists', title: 'Artists' },
   { id: 'albums', title: 'Albums' },
   { id: 'playlists', title: 'Playlists' },
];

type TabBarProps = {
   activeTab: string;
   onTabPress: (tabId: string) => void;
};

export function TabBar({ activeTab, onTabPress }: TabBarProps) {
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
                     backgroundColor: activeTab === tab.id ? '#FFFFFF' : '#2A2A2A',
                     borderRadius: 16,
                     paddingHorizontal: 12,
                     paddingVertical: 4,
                     height: 28,
                     justifyContent: 'center',
                  }}
               >
                  <Text
                     style={{
                        color: activeTab === tab.id ? '#000000' : '#FFFFFF',
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
