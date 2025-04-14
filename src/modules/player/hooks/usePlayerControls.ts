import { Track } from '@/entities';
import { PlayerService } from '@/services/TrackPlayerService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Mutations for player controls
export function usePlayerControls() {
   const queryClient = useQueryClient();

   // Helper function to force refresh currentTrack
   const refreshCurrentTrack = async () => {
      await PlayerService.setupPlayer();
      const newTrack = await PlayerService.getCurrentTrack();
      queryClient.setQueryData(['currentTrack'], newTrack);
   };

   const playTrackMutation = useMutation({
      mutationFn: async ({ track, allTracks }: { track: Track; allTracks: Track[] }) => {
         await PlayerService.playTrack(track, allTracks);
      },
      onSuccess: async (_, variables) => {
         const { track } = variables;
         queryClient.setQueryData(['currentTrack'], track);

         await refreshCurrentTrack();
         queryClient.invalidateQueries({ queryKey: ['playerState'] });
      },
   });

   const shufflePlayMutation = useMutation({
      mutationFn: async ({ tracks }: { tracks: Track[] }) => {
         // Create a copy of the tracks array to avoid mutating the original
         const shuffledTracks = [...tracks];

         for (let i = shuffledTracks.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledTracks[i], shuffledTracks[j]] = [shuffledTracks[j], shuffledTracks[i]];
         }

         if (shuffledTracks.length > 0) {
            await PlayerService.playTrack(shuffledTracks[0], shuffledTracks);
         }
      },
      onSuccess: async () => {
         await refreshCurrentTrack();
         queryClient.invalidateQueries({ queryKey: ['playerState'] });
      },
   });

   const playPauseMutation = useMutation({
      mutationFn: async ({ isPlaying }: { isPlaying: boolean }) => {
         if (isPlaying) {
            await PlayerService.pause();
         } else {
            await PlayerService.play();
         }
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['playerState'] });
      },
   });

   const nextTrackMutation = useMutation({
      mutationFn: async () => {
         await PlayerService.skipToNext();
      },
      onSuccess: async () => {
         await refreshCurrentTrack();
      },
   });

   const previousTrackMutation = useMutation({
      mutationFn: async () => {
         await PlayerService.skipToPrevious();
      },
      onSuccess: async () => {
         await refreshCurrentTrack();
      },
   });

   const toggleRepeatModeMutation = useMutation({
      mutationFn: async () => {
         return PlayerService.toggleRepeatMode();
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['playerState'] });
      },
   });

   return {
      playTrack: playTrackMutation.mutate,
      shufflePlay: shufflePlayMutation.mutate,
      playPause: playPauseMutation.mutate,
      nextTrack: nextTrackMutation.mutate,
      previousTrack: previousTrackMutation.mutate,
      toggleRepeatMode: toggleRepeatModeMutation.mutate,
      isLoading:
         playTrackMutation.isPending ||
         shufflePlayMutation.isPending ||
         playPauseMutation.isPending ||
         nextTrackMutation.isPending ||
         previousTrackMutation.isPending ||
         toggleRepeatModeMutation.isPending,
   };
}
