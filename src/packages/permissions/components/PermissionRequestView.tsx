import { Text } from '@/components/atoms';
import { useTheme } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Alert, Linking, TouchableOpacity, View } from 'react-native';

interface PermissionRequestViewProps {
   onRetry?: () => void;
   isRequesting?: boolean;
   canAskAgain?: boolean;
}

export const PermissionRequestView: React.FC<PermissionRequestViewProps> = ({
   onRetry,
   isRequesting,
   canAskAgain,
}) => {
   const { theme } = useTheme();
   const showSettingsAlert = () => {
      Alert.alert(
         'Permission Denied',
         'Please grant access to your media library in the app settings.',
         [
            {
               text: 'Cancel',
               style: 'cancel',
            },
            {
               text: 'Open Settings',
               onPress: () => Linking.openSettings(),
            },
         ],
         { cancelable: false }
      );
   };

   const onGrantAccess = () => {
      if (onRetry) onRetry();
   };

   return (
      <View
         style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            backgroundColor: theme.colors.background,
         }}
      >
         <View
            style={{
               width: 90,
               height: 90,
               borderRadius: 45,
               backgroundColor: 'rgba(76, 139, 245, 0.15)',
               alignItems: 'center',
               justifyContent: 'center',
               marginBottom: 24,
            }}
         >
            <Ionicons name="musical-notes" size={40} color={theme.colors.primary} />
         </View>
         <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
            Permission Required
         </Text>
         <Text
            style={{
               fontSize: 16,
               textAlign: 'center',
               color: theme.colors.text + '99',
               marginBottom: 36,
               maxWidth: '80%',
               lineHeight: 24,
            }}
         >
            To play your music, we need permission to access your media library.
         </Text>
         <TouchableOpacity
            style={[
               {
                  backgroundColor: theme.colors.primary,
                  paddingVertical: 15,
                  paddingHorizontal: 36,
                  borderRadius: 30,
                  elevation: 3,
                  minWidth: 150,
                  alignItems: 'center',
               },
               isRequesting && { backgroundColor: theme.colors.primary + '99', elevation: 0 },
            ]}
            onPress={canAskAgain ? onGrantAccess : showSettingsAlert}
            activeOpacity={0.8}
            disabled={isRequesting}
         >
            {isRequesting ? (
               <ActivityIndicator size="small" color="#ffffff" />
            ) : (
               <Text style={{ color: '#ffffff', fontSize: 17, fontWeight: 'bold' }}>
                  Grant Access
               </Text>
            )}
         </TouchableOpacity>
      </View>
   );
};
