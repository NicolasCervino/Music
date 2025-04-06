import { useTheme } from '@/theme';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { usePlayer } from '../../player';
import { AlbumList, PopularAlbums } from './components';

export function AlbumsView() {
   const { theme } = useTheme();
   const [expanded, setExpanded] = useState(false);
   const { isVisible } = usePlayer();

   const toggleExpand = useCallback(() => {
      setExpanded(prev => !prev);
   }, []);

   return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
         <AlbumList
            expanded={expanded}
            onExpandToggle={toggleExpand}
            renderHeader={() => <PopularAlbums />}
            isPlayerVisible={isVisible}
         />
      </View>
   );
}
