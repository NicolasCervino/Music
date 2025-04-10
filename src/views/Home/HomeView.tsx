import { PopularAlbums } from '@/features/albums';
import { useSongList } from '@/packages/Songs/hooks/useSongList';
import { SongList } from '@/src/packages';
import { useTheme } from '@/theme';
import { View } from 'react-native';

export function HomeView() {
   const { theme } = useTheme();
   const methods = useSongList();

   return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
         <SongList
            title="Song List"
            {...methods}
            renderHeader={() => <PopularAlbums />}
            headerStyle={{ paddingLeft: 20 }}
         />
      </View>
   );
}
