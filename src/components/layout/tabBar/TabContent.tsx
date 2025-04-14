import { TabRoutes } from '@/constants';
import { AlbumsView, ArtistsView, HomeView, HomeWrapper, PlaylistsView } from '@/modules';
import { View } from 'react-native';

type TabContentProps = {
   activeTab: TabRoutes;
};

export function TabContent({ activeTab }: TabContentProps) {
   return (
      <View style={{ flex: 1 }}>
         {activeTab === TabRoutes.HOME && (
            <HomeWrapper>
               <HomeView />
            </HomeWrapper>
         )}
         {activeTab === TabRoutes.PLAYLISTS && <PlaylistsView />}
         {activeTab === TabRoutes.ARTISTS && <ArtistsView />}
         {activeTab === TabRoutes.ALBUMS && <AlbumsView />}
      </View>
   );
}
