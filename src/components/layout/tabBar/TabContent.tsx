import { TabRoutes } from '@/constants';
import { AlbumsView, ArtistsView, HomeView, PlaylistsView } from '@/modules';
import { View } from 'react-native';

type TabContentProps = {
   activeTab: TabRoutes;
};

export function TabContent({ activeTab }: TabContentProps) {
   return (
      <View style={{ flex: 1 }}>
         {activeTab === TabRoutes.HOME && <HomeView />}
         {activeTab === TabRoutes.PLAYLISTS && <PlaylistsView />}
         {activeTab === TabRoutes.ARTISTS && <ArtistsView />}
         {activeTab === TabRoutes.ALBUMS && <AlbumsView />}
      </View>
   );
}
