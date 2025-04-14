import { Text } from '@/components/atoms';
import { Modal, useModalContext } from '@/components/layout/modal';
import { Playlist } from '@/entities';
import { useTheme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { usePlaylists } from '../../../hooks';

interface DeletePlaylistModalProps {
   playlist: Playlist | null;
}

export function DeletePlaylistModal({ playlist }: DeletePlaylistModalProps): React.ReactElement {
   const { theme } = useTheme();
   const { close } = useModalContext();
   const { remove } = usePlaylists();

   // Animation value
   const fadeIn = useRef(new Animated.Value(0)).current;

   useEffect(() => {
      Animated.timing(fadeIn, {
         toValue: 1,
         duration: 250,
         useNativeDriver: true,
      }).start();
   }, []);

   const handleDelete = async () => {
      if (!playlist) return;

      try {
         await remove.mutateAsync(playlist.id);
         close();
      } catch (error) {
         console.error('Error deleting playlist:', error);
      }
   };

   return (
      <Modal overlay height={240}>
         <Animated.View
            style={[
               styles.container,
               {
                  backgroundColor: theme.colors.background,
                  opacity: fadeIn,
                  transform: [
                     {
                        translateY: fadeIn.interpolate({
                           inputRange: [0, 1],
                           outputRange: [10, 0],
                        }),
                     },
                  ],
               },
            ]}
         >
            <View style={styles.content}>
               <Text variant="heading" style={[styles.title, { color: theme.colors.text }]}>
                  Delete "{playlist?.name}"?
               </Text>

               <Text style={[styles.message, { color: theme.colors.text + 'CC' }]}>
                  This playlist will be permanently removed from your library.
               </Text>
            </View>

            <View
               style={[
                  styles.footer,
                  { borderTopColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
               ]}
            >
               <Pressable
                  style={({ pressed }) => [
                     styles.button,
                     {
                        backgroundColor: pressed
                           ? theme.dark
                              ? 'rgba(255,255,255,0.05)'
                              : 'rgba(0,0,0,0.05)'
                           : 'transparent',
                     },
                  ]}
                  onPress={close}
               >
                  <Text style={[styles.buttonText, { color: theme.colors.text }]}>Cancel</Text>
               </Pressable>

               <Pressable
                  style={({ pressed }) => [
                     styles.deleteButton,
                     {
                        backgroundColor: pressed
                           ? 'rgba(211, 47, 47, 0.8)'
                           : 'rgba(211, 47, 47, 0.9)',
                        transform: [{ scale: pressed ? 0.98 : 1 }],
                     },
                  ]}
                  onPress={handleDelete}
               >
                  <Text style={styles.deleteButtonText}>Delete</Text>
               </Pressable>
            </View>

            <Pressable
               style={styles.closeButton}
               onPress={close}
               hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
               <Ionicons name="close" size={22} color={theme.colors.text + '99'} />
            </Pressable>
         </Animated.View>
      </Modal>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      borderRadius: 16,
      overflow: 'hidden',
      position: 'relative',
   },
   content: {
      padding: 24,
      flex: 1,
      justifyContent: 'center',
   },
   title: {
      fontSize: 20,
      fontWeight: '700',
      marginBottom: 12,
      textAlign: 'center',
   },
   message: {
      fontSize: 16,
      lineHeight: 22,
      textAlign: 'center',
   },
   footer: {
      flexDirection: 'row',
      borderTopWidth: StyleSheet.hairlineWidth,
      height: 56,
   },
   button: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
   buttonText: {
      fontSize: 16,
      fontWeight: '500',
   },
   deleteButton: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderLeftWidth: StyleSheet.hairlineWidth,
      borderLeftColor: 'rgba(0,0,0,0.1)',
   },
   deleteButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: 'white',
   },
   closeButton: {
      position: 'absolute',
      top: 14,
      right: 14,
      padding: 4,
      zIndex: 10,
   },
});
