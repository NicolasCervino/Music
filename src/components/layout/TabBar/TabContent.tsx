import { ArtistsView } from '@/features/artists';
import AlbumsView from '@/views/Albums/AlbumsView';
import HomeView from '@/views/Home/HomeView';
import PlaylistsView from '@/views/Playlists/PlaylistsView';
import { View } from 'react-native';

type TabContentProps = {
   activeTab: string;
};

export function TabContent({ activeTab }: TabContentProps) {
   return (
      <View style={{ flex: 1 }}>
         {activeTab === 'home' && <HomeView />}
         {activeTab === 'playlists' && <PlaylistsView />}
         {activeTab === 'artists' && <ArtistsView />}
         {activeTab === 'albums' && <AlbumsView />}
      </View>
   );
}
