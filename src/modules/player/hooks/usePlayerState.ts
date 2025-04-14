import { useQuery, useQueryClient } from '@tanstack/react-query';
import TrackPlayer, { State } from 'react-native-track-player';

// Get current player state
export function usePlayerState() {
  return useQuery({
    queryKey: ['playerState'],
    queryFn: async () => {
      const state = await TrackPlayer.getState();
      const repeatMode = await TrackPlayer.getRepeatMode();
      
      return {
        isPlaying: state === State.Playing,
        repeatMode,
      };
    },
    refetchInterval: 300, // Poll for player state
  });
}

// Get/set player expansion state
export function usePlayerExpansion() {
  const queryClient = useQueryClient();
  
  return {
    isExpanded: useQuery({
      queryKey: ['playerExpanded'],
      queryFn: () => false,
      initialData: false,
    }),
    
    setIsExpanded: (expanded: boolean) => {
      queryClient.setQueryData(['playerExpanded'], expanded);
    }
  };
} 