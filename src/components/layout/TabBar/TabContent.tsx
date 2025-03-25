import { View } from 'react-native';
import HomeView from '@/views/Home/HomeView';
import PlaylistsView from '@/views/Playlists/PlaylistsView';
import ArtistsView from '@/views/Artists/ArtistsView';
import AlbumsView from '@/views/Albums/AlbumsView';

type TabContentProps = {
  activeTab: string;
};

export default function TabContent({ activeTab }: TabContentProps) {
  return (
    <View style={{ flex: 1 }}>
      {activeTab === 'home' && <HomeView />}
      {activeTab === 'playlists' && <PlaylistsView />}
      {activeTab === 'artists' && <ArtistsView />}
      {activeTab === 'albums' && <AlbumsView />}
    </View>
  );
}