import { Playlist } from '@/entities';
import { DatabaseService } from '@/services/database';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const PLAYLIST_QUERY_KEY = 'playlists';
const STALE_TIME = 1000 * 60 * 5; // 5 minutes

export const usePlaylists = () => {
   const queryClient = useQueryClient();

   const getAll = useQuery({
      queryKey: [PLAYLIST_QUERY_KEY],
      queryFn: DatabaseService.getPlaylists,
      staleTime: STALE_TIME,
   });

   const getById = (playlistId: string) =>
      useQuery({
         queryKey: [PLAYLIST_QUERY_KEY, playlistId],
         queryFn: () => DatabaseService.getPlaylistById(playlistId),
         staleTime: STALE_TIME,
         enabled: !!playlistId,
      });

   const getTracks = (playlistId: string) =>
      useQuery({
         queryKey: [PLAYLIST_QUERY_KEY, playlistId, 'tracks'],
         queryFn: () => DatabaseService.getPlaylistTracks(playlistId),
         staleTime: STALE_TIME,
         enabled: !!playlistId,
      });

   const create = useMutation({
      mutationFn: (playlist: Omit<Playlist, 'id'>) => DatabaseService.createPlaylist(playlist),
      onSuccess: newPlaylist => {
         queryClient.invalidateQueries({ queryKey: [PLAYLIST_QUERY_KEY] });
         return newPlaylist;
      },
   });

   const update = useMutation({
      mutationFn: (playlist: Playlist) => DatabaseService.updatePlaylist(playlist),
      onSuccess: updatedPlaylist => {
         queryClient.invalidateQueries({ queryKey: [PLAYLIST_QUERY_KEY, updatedPlaylist.id] });
         queryClient.invalidateQueries({ queryKey: [PLAYLIST_QUERY_KEY] });
         return updatedPlaylist;
      },
   });

   const remove = useMutation({
      mutationFn: (playlistId: string) => DatabaseService.deletePlaylist(playlistId),
      onSuccess: (_, playlistId) => {
         queryClient.invalidateQueries({ queryKey: [PLAYLIST_QUERY_KEY] });
         queryClient.removeQueries({ queryKey: [PLAYLIST_QUERY_KEY, playlistId] });
      },
   });

   const addTrack = useMutation({
      mutationFn: ({ playlistId, trackId }: { playlistId: string; trackId: string }) =>
         DatabaseService.addTrackToPlaylist(playlistId, trackId),
      onSuccess: (_, { playlistId }) => {
         queryClient.invalidateQueries({ queryKey: [PLAYLIST_QUERY_KEY, playlistId] });
         queryClient.invalidateQueries({ queryKey: [PLAYLIST_QUERY_KEY, playlistId, 'tracks'] });
         queryClient.invalidateQueries({ queryKey: [PLAYLIST_QUERY_KEY] });
      },
   });

   const removeTrack = useMutation({
      mutationFn: ({ playlistId, trackId }: { playlistId: string; trackId: string }) =>
         DatabaseService.removeTrackFromPlaylist(playlistId, trackId),
      onSuccess: (_, { playlistId }) => {
         queryClient.invalidateQueries({ queryKey: [PLAYLIST_QUERY_KEY, playlistId] });
         queryClient.invalidateQueries({ queryKey: [PLAYLIST_QUERY_KEY, playlistId, 'tracks'] });
         queryClient.invalidateQueries({ queryKey: [PLAYLIST_QUERY_KEY] });
      },
   });

   const reorderTracks = useMutation({
      mutationFn: ({ playlistId, trackIds }: { playlistId: string; trackIds: string[] }) =>
         DatabaseService.reorderPlaylistTracks(playlistId, trackIds),
      onSuccess: (_, { playlistId }) => {
         queryClient.invalidateQueries({ queryKey: [PLAYLIST_QUERY_KEY, playlistId] });
         queryClient.invalidateQueries({ queryKey: [PLAYLIST_QUERY_KEY, playlistId, 'tracks'] });
         queryClient.invalidateQueries({ queryKey: [PLAYLIST_QUERY_KEY] });
      },
   });

   return {
      data: getAll.data,
      isLoading: getAll.isLoading,
      isError: getAll.isError,
      error: getAll.error,
      getById,
      getTracks,
      create,
      update,
      remove,
      addTrack,
      removeTrack,
      reorderTracks,
   };
};
