import { PopularAlbums } from '@/modules/albums';
import { useSongList } from '@/packages/Songs/hooks/useSongList';
import { MenuOption } from '@/src/components/atoms/ContextMenu';
import { Track } from '@/src/entities';
import { SongList } from '@/src/packages';
import { useTheme } from '@/theme';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { View } from 'react-native';

export function HomeView() {
   const { theme } = useTheme();
   const methods = useSongList();
   const router = useRouter();

   const getTrackMenuOptions = useCallback((track: Track): MenuOption[] => {
      return [
         {
            label: `Add to playlist`,
            icon: 'add-circle-outline',
            onPress: () => {
               console.log('Add to playlist', track);
            },
         },
         {
            label: `Go to artist`,
            icon: 'person-outline',
            onPress: () => {
               router.push(`/artist/${track.artist.id}`);
            },
         },
         {
            label: `Go to album  `,
            icon: 'musical-notes-outline',
            onPress: () => {
               router.push(`/album/${track.album.id}`);
            },
         },
      ];
   }, []);

   return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
         <SongList
            title="Song List"
            {...methods}
            renderHeader={() => <PopularAlbums />}
            headerStyle={{ paddingLeft: 20 }}
            trackMenuOptions={getTrackMenuOptions}
         />
      </View>
   );
}
