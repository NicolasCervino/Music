import { ModalWrapper } from '@/components/layout/modal';
import { PopularAlbums } from '@/modules/albums';
import { useSongList } from '@/packages/Songs/hooks/useSongList';
import { MenuOption } from '@/src/components/atoms';
import { Track } from '@/src/entities';
import { SongList } from '@/src/packages';
import { useTheme } from '@/theme';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { View } from 'react-native';
import { useHomeContext } from '../hooks';
import { CreatePlaylistModal } from './components/modal/CreatePlaylistModal';
import { PlaylistSelectionModal } from './components/modal/PlaylistSelectionModal';
import { SelectSongsModal } from './components/modal/SelectSongsModal';

export function HomeView() {
   const { theme } = useTheme();
   const methods = useSongList();
   const router = useRouter();
   const {
      selectedTrack,
      playlistData,
      onPlaylistCreated,
      onAddToPlaylistSuccess,
      onPlaylistDataSubmit,
      onAddToPlaylist,
      modals,
   } = useHomeContext();

   const getTrackMenuOptions = useCallback(
      (track: Track): MenuOption[] => {
         return [
            {
               label: `Add to playlist`,
               icon: 'add-circle-outline',
               onPress: () => {
                  onAddToPlaylist(track);
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
      },
      [router, onAddToPlaylist]
   );

   return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
         <SongList
            title="Song List"
            {...methods}
            renderHeader={() => <PopularAlbums />}
            headerStyle={{ paddingLeft: 20 }}
            trackMenuOptions={getTrackMenuOptions}
         />

         {/* Add to playlist modal */}
         <ModalWrapper methods={modals.playlistSelection ?? undefined}>
            {selectedTrack && (
               <PlaylistSelectionModal
                  track={selectedTrack}
                  onAddSuccess={onAddToPlaylistSuccess}
                  onCreatePlaylistRequest={() => {
                     modals.playlistSelection?.close();
                     modals.createPlaylist?.open();
                  }}
               />
            )}
         </ModalWrapper>

         {/* Create playlist modal */}
         <ModalWrapper methods={modals.createPlaylist ?? undefined}>
            <CreatePlaylistModal trackId={selectedTrack?.id} onNext={onPlaylistDataSubmit} />
         </ModalWrapper>

         {/* Select songs modal */}
         <ModalWrapper methods={modals.selectSongs ?? undefined}>
            <SelectSongsModal
               playlistData={playlistData || undefined}
               initialTrackId={playlistData?.trackId}
               onSuccess={onPlaylistCreated}
            />
         </ModalWrapper>
      </View>
   );
}
