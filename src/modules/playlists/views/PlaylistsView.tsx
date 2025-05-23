import { ModalWrapper, useModal } from '@/components/layout/modal';
import { useCurrentTrack } from '@/modules/player';
import { useTheme } from '@/theme';
import React, { useState } from 'react';
import { View } from 'react-native';
import { FloatingButton } from './components/FloatingButton';
import { PlaylistList } from './components/list/PlaylistList';
import { CreatePlaylistModal } from './components/modal/CreatePlaylistModal';
import { SelectSongsModal } from './components/modal/SelectSongsModal';

export function PlaylistsView(): React.ReactElement {
   const { theme } = useTheme();
   const [expanded, setExpanded] = useState(false);
   const { data: currentTrack } = useCurrentTrack();
   const isPlayerVisible = !!currentTrack;

   // Playlist creation state
   const [playlistData, setPlaylistData] = useState<{
      name: string;
      description: string;
   } | null>(null);

   const createPlaylistModal = useModal({});
   const selectSongsModal = useModal({});

   const handlePlaylistDataSubmit = (data: { name: string; description: string }) => {
      setPlaylistData(data);
      selectSongsModal.open();
   };

   return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
         <PlaylistList
            initialVisibleCount={7}
            expanded={expanded}
            onExpandToggle={() => setExpanded(prev => !prev)}
            isPlayerVisible={isPlayerVisible}
         />

         <FloatingButton onPress={createPlaylistModal.open} isExpanded={expanded} />

         <ModalWrapper methods={createPlaylistModal}>
            <CreatePlaylistModal onNext={handlePlaylistDataSubmit} />
         </ModalWrapper>

         <ModalWrapper methods={selectSongsModal}>
            <SelectSongsModal
               playlistData={playlistData || undefined}
               onComplete={() => setPlaylistData(null)}
            />
         </ModalWrapper>
      </View>
   );
}
