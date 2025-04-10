import { AlbumsView } from '@/features/albums';
import { ArtistsView } from '@/features/artists';
import { PlaylistsView } from '@/features/playlists';
import { HomeView } from '@/views/Home/HomeView';
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
