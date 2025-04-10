import { Playlist } from '@/entities';
import { DatabaseService } from '@/services/database';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const PLAYLIST_QUERY_KEY = 'playlists';
const STALE_TIME = 1000 * 60 * 5; // 5 minutes

export const usePlaylists = () => {
   return useQuery({
      queryKey: [PLAYLIST_QUERY_KEY],
      queryFn: DatabaseService.getPlaylists,
      staleTime: STALE_TIME,
   });
};

export const usePlaylist = (playlistId: string) => {
   return useQuery({
      queryKey: [PLAYLIST_QUERY_KEY, playlistId],
      queryFn: () => DatabaseService.getPlaylistById(playlistId),
      staleTime: STALE_TIME,
      enabled: !!playlistId,
   });
};

export const usePlaylistTracks = (playlistId: string) => {
   return useQuery({
      queryKey: [PLAYLIST_QUERY_KEY, playlistId, 'tracks'],
      queryFn: () => DatabaseService.getPlaylistTracks(playlistId),
      staleTime: STALE_TIME,
      enabled: !!playlistId,
   });
};

export const useCreatePlaylist = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: (playlist: Omit<Playlist, 'id'>) => DatabaseService.createPlaylist(playlist),
      onSuccess: newPlaylist => {
         queryClient.invalidateQueries({ queryKey: [PLAYLIST_QUERY_KEY] });
         return newPlaylist;
      },
   });
};

export const useUpdatePlaylist = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: (playlist: Playlist) => DatabaseService.updatePlaylist(playlist),
      onSuccess: updatedPlaylist => {
         queryClient.invalidateQueries({ queryKey: [PLAYLIST_QUERY_KEY, updatedPlaylist.id] });
         queryClient.invalidateQueries({ queryKey: [PLAYLIST_QUERY_KEY] });
         return updatedPlaylist;
      },
   });
};

export const useDeletePlaylist = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: (playlistId: string) => DatabaseService.deletePlaylist(playlistId),
      onSuccess: (_, playlistId) => {
         queryClient.invalidateQueries({ queryKey: [PLAYLIST_QUERY_KEY] });
         queryClient.removeQueries({ queryKey: [PLAYLIST_QUERY_KEY, playlistId] });
      },
   });
};

export const useAddTrackToPlaylist = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: ({ playlistId, trackId }: { playlistId: string; trackId: string }) =>
         DatabaseService.addTrackToPlaylist(playlistId, trackId),
      onSuccess: (_, { playlistId }) => {
         queryClient.invalidateQueries({ queryKey: [PLAYLIST_QUERY_KEY, playlistId] });
         queryClient.invalidateQueries({ queryKey: [PLAYLIST_QUERY_KEY, playlistId, 'tracks'] });
         queryClient.invalidateQueries({ queryKey: [PLAYLIST_QUERY_KEY] });
      },
   });
};

export const useRemoveTrackFromPlaylist = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: ({ playlistId, trackId }: { playlistId: string; trackId: string }) =>
         DatabaseService.removeTrackFromPlaylist(playlistId, trackId),
      onSuccess: (_, { playlistId }) => {
         queryClient.invalidateQueries({ queryKey: [PLAYLIST_QUERY_KEY, playlistId] });
         queryClient.invalidateQueries({ queryKey: [PLAYLIST_QUERY_KEY, playlistId, 'tracks'] });
         queryClient.invalidateQueries({ queryKey: [PLAYLIST_QUERY_KEY] });
      },
   });
};

export const useReorderPlaylistTracks = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: ({ playlistId, trackIds }: { playlistId: string; trackIds: string[] }) =>
         DatabaseService.reorderPlaylistTracks(playlistId, trackIds),
      onSuccess: (_, { playlistId }) => {
         queryClient.invalidateQueries({ queryKey: [PLAYLIST_QUERY_KEY, playlistId] });
         queryClient.invalidateQueries({ queryKey: [PLAYLIST_QUERY_KEY, playlistId, 'tracks'] });
         queryClient.invalidateQueries({ queryKey: [PLAYLIST_QUERY_KEY] });
      },
   });
};
