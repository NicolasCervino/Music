import { useModal } from '@/components/layout/modal';
import { useToastContext } from '@/packages/toast/hooks';
import { Track } from '@/src/entities';
import { useCallback, useState } from 'react';
import { HomeContextType } from '../provider/HomeContext';

export const useHome = (): HomeContextType => {
   const { showToast } = useToastContext();
   const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

   const [playlistData, setPlaylistData] = useState<{
      name: string;
      description: string;
      trackId?: string;
   } | null>(null);

   const playlistSelectionModal = useModal({});
   const createPlaylistModal = useModal({});
   const selectSongsModal = useModal({});

   const onAddToPlaylist = (track: Track) => {
      setSelectedTrack(track);
      playlistSelectionModal.open();
   };

   const onPlaylistDataSubmit = (data: { name: string; description: string; trackId?: string }) => {
      setPlaylistData({
         ...data,
         trackId: data.trackId || selectedTrack?.id,
      });
      selectSongsModal.open();
   };

   const onPlaylistCreated = useCallback(() => {
      showToast({
         message: 'Playlist created successfully!',
         type: 'success',
      });
      setPlaylistData(null);
      setSelectedTrack(null);
   }, [showToast]);

   const onAddToPlaylistSuccess = useCallback(
      (playlistName: string) => {
         showToast({
            message: `Added to "${playlistName}" playlist!`,
            type: 'success',
         });
         setSelectedTrack(null);
      },
      [showToast]
   );

   return {
      selectedTrack,
      onAddToPlaylist,
      playlistData,
      setPlaylistData,
      onPlaylistDataSubmit,
      onPlaylistCreated,
      onAddToPlaylistSuccess,
      modals: {
         playlistSelection: playlistSelectionModal,
         createPlaylist: createPlaylistModal,
         selectSongs: selectSongsModal,
      },
   };
};
