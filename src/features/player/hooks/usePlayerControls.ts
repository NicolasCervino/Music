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
    mutationFn: async ({ track, allTracks }: { track: Track, allTracks: Track[] }) => {
      await PlayerService.playTrack(track, allTracks);
    },
    onSuccess: async (_, variables) => {
      // Actualizar directamente currentTrack con la canción seleccionada
      // para una respuesta instantánea en la UI
      const { track } = variables;
      queryClient.setQueryData(['currentTrack'], track);
      
      // Luego refrescar para asegurar sincronización con el reproductor real
      await refreshCurrentTrack();
      queryClient.invalidateQueries({ queryKey: ['playerState'] });
    }
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
    }
  });
  
  const nextTrackMutation = useMutation({
    mutationFn: async () => {
      await PlayerService.skipToNext();
    },
    onSuccess: async () => {
      await refreshCurrentTrack();
    }
  });
  
  const previousTrackMutation = useMutation({
    mutationFn: async () => {
      await PlayerService.skipToPrevious();
    },
    onSuccess: async () => {
      await refreshCurrentTrack();
    }
  });
  
  const toggleRepeatModeMutation = useMutation({
    mutationFn: async () => {
      return PlayerService.toggleRepeatMode();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playerState'] });
    }
  });
  
  return {
    playTrack: playTrackMutation.mutate,
    playPause: playPauseMutation.mutate,
    nextTrack: nextTrackMutation.mutate,
    previousTrack: previousTrackMutation.mutate,
    toggleRepeatMode: toggleRepeatModeMutation.mutate,
    isLoading: 
      playTrackMutation.isPending || 
      playPauseMutation.isPending || 
      nextTrackMutation.isPending || 
      previousTrackMutation.isPending ||
      toggleRepeatModeMutation.isPending
  };
} 