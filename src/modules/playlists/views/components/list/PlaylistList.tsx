import { MenuOption } from '@/components/atoms/ContextMenu';
import { ErrorBoundary } from '@/components/layout/error-boundary/ErrorBoundary';
import { ModalWrapper, useModal } from '@/components/layout/modal';
import { CollapsibleList } from '@/src/components/widgets';
import { PLAYER_BAR_HEIGHT } from '@/src/constants/dimensions';
import { Playlist } from '@/src/entities';
import { Href, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { usePlaylists } from '../../../hooks/usePlaylists';
import { PlaylistCard } from '../item/PlaylistCard';
import { CreatePlaylistModal } from '../modal/CreatePlaylistModal';
import { DeletePlaylistModal } from '../modal/DeletePlaylistModal';

const ITEM_HEIGHT = 76; // Height of each playlist row

export interface PlaylistListProps {
   initialVisibleCount?: number;
   expanded: boolean;
   onExpandToggle: () => void;
   renderHeader?: () => React.ReactNode;
   headerStyle?: StyleProp<ViewStyle>;
   isPlayerVisible: boolean;
}

export function PlaylistList({
   initialVisibleCount = 5,
   expanded,
   onExpandToggle,
   renderHeader,
   headerStyle,
   isPlayerVisible,
}: PlaylistListProps): React.ReactElement {
   const { data: playlists = [], isLoading } = usePlaylists();
   const listPadding = isPlayerVisible ? PLAYER_BAR_HEIGHT : 0;
   const router = useRouter();

   // Selected playlist for editing or deleting
   const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

   // Modal controls
   const renameModal = useModal({});
   const deleteModal = useModal({});

   const handleRename = (playlist: Playlist) => {
      setSelectedPlaylist(playlist);
      renameModal.open();
   };

   const handleDelete = (playlist: Playlist) => {
      setSelectedPlaylist(playlist);
      deleteModal.open();
   };

   const getMenuOptionsForPlaylist = (playlist: Playlist): MenuOption[] => {
      return [
         {
            label: 'Rename',
            icon: 'pencil-outline',
            onPress: () => {
               handleRename(playlist);
            },
         },
         {
            label: 'Delete',
            icon: 'trash-outline',
            onPress: () => {
               handleDelete(playlist);
            },
         },
      ];
   };

   const renderPlaylistItem = ({ item: playlist }: { item: Playlist }) => (
      <PlaylistCard
         playlist={playlist}
         onPress={() => router.push(`/playlist/${playlist.id}` as unknown as Href)}
         menuOptions={getMenuOptionsForPlaylist(playlist)}
      />
   );

   const keyExtractor = (item: Playlist) => `playlist-${item.id}`;

   return (
      <>
         <ErrorBoundary isLoading={isLoading} fallback={<View style={{ height: 300 }} />}>
            <CollapsibleList
               title="Playlists"
               data={playlists}
               renderItem={renderPlaylistItem}
               keyExtractor={keyExtractor}
               renderHeader={renderHeader}
               headerStyle={headerStyle}
               initialVisibleCount={initialVisibleCount}
               estimatedItemSize={ITEM_HEIGHT}
               bottomPadding={listPadding}
               isLoading={isLoading}
               fallback={<View style={{ height: 300 }} />}
               expanded={expanded}
               onExpandToggle={onExpandToggle}
            />
         </ErrorBoundary>

         {/* Rename Playlist Modal */}
         <ModalWrapper methods={renameModal}>
            <CreatePlaylistModal playlist={selectedPlaylist} isEditing={true} />
         </ModalWrapper>

         {/* Delete Playlist Modal */}
         <ModalWrapper methods={deleteModal}>
            <DeletePlaylistModal playlist={selectedPlaylist} />
         </ModalWrapper>
      </>
   );
}
