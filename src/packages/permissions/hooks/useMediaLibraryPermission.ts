import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { PermissionsService } from '../service';

const PERMISSION_QUERY_KEY = 'mediaLibraryPermission';
const STALE_TIME = 1000 * 60 * 5;

export const useMediaLibraryPermission = () => {
   const queryClient = useQueryClient();
   const appState = useRef(AppState.currentState);

   const checkPermissionQuery = useQuery({
      queryKey: [PERMISSION_QUERY_KEY],
      queryFn: PermissionsService.checkMediaLibraryPermissions,
      staleTime: STALE_TIME,
      gcTime: STALE_TIME * 2,
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchInterval: false,
      refetchOnReconnect: false,
   });

   useEffect(() => {
      const subscription = AppState.addEventListener('change', onAppStateChange);

      return () => {
         subscription.remove();
      };
   }, []);

   const onAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
         queryClient.refetchQueries({ queryKey: [PERMISSION_QUERY_KEY] });
      }

      appState.current = nextAppState;
   };

   const requestPermissionMutation = useMutation({
      mutationFn: PermissionsService.requestMediaLibraryPermissions,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [PERMISSION_QUERY_KEY] });
      },
      onSettled: () => {
         queryClient.invalidateQueries({ queryKey: [PERMISSION_QUERY_KEY] });
      },
   });

   return {
      checkPermissionQuery,
      requestPermissionMutation,
      refetchPermissions: () => queryClient.refetchQueries({ queryKey: [PERMISSION_QUERY_KEY] }),
   };
};
