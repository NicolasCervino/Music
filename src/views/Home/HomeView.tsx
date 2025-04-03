import { NewAlbums } from '@/packages/Albums/NewAlbums';
import { SongList } from '@/packages/Songs/SongList';
import { useSongList } from '@/packages/Songs/hooks/useSongList';
import { useTheme } from '@/theme';
import { View } from 'react-native';

export function HomeView() {
   const { theme } = useTheme();
   const methods = useSongList();

   return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
         <SongList {...methods} renderHeader={() => <NewAlbums />} />
      </View>
   );
}
