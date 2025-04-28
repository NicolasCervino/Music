import * as MediaLibrary from 'expo-media-library';
import { PermissionError, PermissionResult } from '../models';

const requestMediaLibraryPermissions = async (): Promise<PermissionResult> => {
   try {
      const permissionResponse = await MediaLibrary.requestPermissionsAsync();
      if (__DEV__) {
         console.log(
            '[PermissionsService] requestMediaLibraryPermissions response:',
            permissionResponse
         );
      }
      const { status, canAskAgain } = permissionResponse;
      const result: PermissionResult = {
         granted: status === 'granted',
         error: status !== 'granted' ? 'Media library permission not granted' : undefined,
         canAskAgain,
      };

      return result;
   } catch (error) {
      if (__DEV__) {
         console.error('Error requesting media library permissions:', error);
      }
      return {
         granted: false,
         error: error instanceof Error ? error.message : 'Unknown error requesting permissions',
         canAskAgain: false, // Assume we can't ask again if there was an error
      };
   }
};

const checkMediaLibraryPermissions = async (): Promise<PermissionResult> => {
   try {
      const permissionResponse = await MediaLibrary.getPermissionsAsync();
      if (__DEV__) {
         console.log(
            '[PermissionsService] checkMediaLibraryPermissions response:',
            permissionResponse
         );
      }
      const { status, canAskAgain } = permissionResponse;
      const result: PermissionResult = {
         granted: status === 'granted',
         error: status !== 'granted' ? 'Media library permission not granted' : undefined,
         canAskAgain,
      };

      return result;
   } catch (error) {
      if (__DEV__) {
         console.error('Error checking media library permissions:', error);
      }
      return {
         granted: false,
         error: error instanceof Error ? error.message : 'Unknown error checking permissions',
         canAskAgain: false,
      };
   }
};

const throwIfNoMediaLibraryPermission = async (): Promise<void> => {
   const permissionResult = await checkMediaLibraryPermissions();
   if (!permissionResult.granted) {
      throw new PermissionError(permissionResult.error || 'Media library permission not granted');
   }
};

export const PermissionsService = {
   requestMediaLibraryPermissions,
   checkMediaLibraryPermissions,
   throwIfNoMediaLibraryPermission,
};
