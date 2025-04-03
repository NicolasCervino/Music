import { NewAlbums } from '@/packages/Albums/NewAlbums';
import { SongList } from '@/packages/Songs/SongList';
import { useTheme } from '@/theme';
import { memo, useCallback } from 'react';
import { View } from 'react-native';

const Header = memo(() => <NewAlbums />);

export default function HomeView() {
   const { theme } = useTheme();

   const renderHeader = useCallback(() => <Header />, []);

   return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
         <SongList listHeaderComponent={renderHeader} />
      </View>
   );
}
