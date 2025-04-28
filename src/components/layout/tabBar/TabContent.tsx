import { ErrorBoundary } from '@/components/layout/error-boundary/ErrorBoundary';
import { TabRoutes } from '@/constants';
import { AlbumsView, ArtistsView, HomeView, HomeWrapper, PlaylistsView } from '@/modules';
import { PermissionRequestView, useMediaLibraryPermission } from '@/packages';
import React from 'react';
import { View } from 'react-native';

type TabContentProps = {
   activeTab: TabRoutes;
};

export function TabContent({ activeTab }: TabContentProps) {
   const { checkPermissionQuery, requestPermissionMutation, refetchPermissions } =
      useMediaLibraryPermission();

   const permissionNeeded =
      checkPermissionQuery.isError ||
      (checkPermissionQuery.isSuccess && !checkPermissionQuery.data.granted);

   if (permissionNeeded) {
      const handleRetry = checkPermissionQuery.isError
         ? refetchPermissions
         : requestPermissionMutation.mutate;

      const canAskAgain =
         checkPermissionQuery.isSuccess && checkPermissionQuery.data?.canAskAgain ? true : false;

      return (
         <PermissionRequestView
            onRetry={handleRetry}
            isRequesting={requestPermissionMutation.isPending}
            canAskAgain={canAskAgain}
         />
      );
   }

   const getContentForTab = () => {
      switch (activeTab) {
         case TabRoutes.HOME:
            return (
               <HomeWrapper>
                  <HomeView />
               </HomeWrapper>
            );
         case TabRoutes.PLAYLISTS:
            return <PlaylistsView />;
         case TabRoutes.ARTISTS:
            return <ArtistsView />;
         case TabRoutes.ALBUMS:
            return <AlbumsView />;
         default:
            return null;
      }
   };

   return (
      <View style={{ flex: 1 }}>
         <ErrorBoundary>{getContentForTab()}</ErrorBoundary>
      </View>
   );
}
