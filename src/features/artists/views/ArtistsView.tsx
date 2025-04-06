import { useTheme } from '@/theme';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { ArtistList } from './components/list/ArtistList';
import { PopularArtists } from './components/list/PopularArtists';

export function ArtistsView() {
   const { theme } = useTheme();
   const [expanded, setExpanded] = useState(false);

   const toggleExpand = useCallback(() => {
      setExpanded(prev => !prev);
   }, []);

   return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
         <ArtistList
            expanded={expanded}
            onExpandToggle={toggleExpand}
            renderHeader={() => <PopularArtists />}
         />
      </View>
   );
}
