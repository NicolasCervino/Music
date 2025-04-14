import { AccentButton, Text } from '@/components/atoms';
import { Modal, useModalContext } from '@/components/layout/modal';
import { Playlist, Track } from '@/entities';
import { usePlaylists } from '@/modules/playlists/hooks';
import { useTheme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, FlatList, Pressable, StyleSheet, View } from 'react-native';

interface PlaylistSelectionModalProps {
   track: Track;

   onAddSuccess?: (playlistName: string) => void;
   onCreatePlaylistRequest: () => void;
}

export function PlaylistSelectionModal({
   track,
   onAddSuccess,
   onCreatePlaylistRequest,
}: PlaylistSelectionModalProps): React.ReactElement {
   const { theme } = useTheme();
   const { close } = useModalContext();
   const { data: playlists = [], isLoading, addTrack } = usePlaylists();

   // Animation value
   const fadeIn = useRef(new Animated.Value(0)).current;

   useEffect(() => {
      Animated.timing(fadeIn, {
         toValue: 1,
         duration: 250,
         useNativeDriver: true,
      }).start();
   }, []);

   const handleAddToPlaylist = async (playlist: Playlist) => {
      try {
         await addTrack.mutateAsync({
            playlistId: playlist.id,
            trackId: track.id,
         });

         close();
         // Call success callback with playlist name
         onAddSuccess?.(playlist.name);
      } catch (error) {
         console.error('Error adding track to playlist:', error);
      }
   };

   const handleCreatePlaylist = () => {
      close();
      onCreatePlaylistRequest();
   };

   const renderPlaylistItem = useCallback(
      ({ item: playlist }: { item: Playlist }) => {
         const isTrackInPlaylist = playlist.trackIds.includes(track.id);

         return (
            <Pressable
               onPress={() => handleAddToPlaylist(playlist)}
               style={[styles.playlistItem, isTrackInPlaylist && styles.disabledItem]}
               disabled={isTrackInPlaylist}
            >
               <View style={styles.playlistInfo}>
                  <Text style={{ color: theme.colors.text, fontWeight: '500' }}>
                     {playlist.name}
                  </Text>
                  <Text style={{ color: theme.colors.text + '80', fontSize: 12 }}>
                     {playlist.trackIds.length} {playlist.trackIds.length === 1 ? 'song' : 'songs'}
                  </Text>
               </View>

               {isTrackInPlaylist ? (
                  <Text style={{ color: theme.colors.text + '60', fontSize: 12 }}>
                     Already added
                  </Text>
               ) : (
                  <Ionicons name="add-circle-outline" size={22} color={theme.colors.primary} />
               )}
            </Pressable>
         );
      },
      [track.id, theme]
   );

   return (
      <Modal overlay height={500}>
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
            <View style={styles.header}>
               <Text variant="heading" style={{ color: theme.colors.text }}>
                  Add to Playlist
               </Text>
               <Pressable
                  style={styles.closeButton}
                  onPress={close}
                  hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
               >
                  <Ionicons name="close" size={22} color={theme.colors.text + '99'} />
               </Pressable>
            </View>

            <View style={styles.content}>
               <AccentButton
                  title="Create New Playlist"
                  onPress={handleCreatePlaylist}
                  buttonStyle={styles.createButton}
                  iconName="add-circle-outline"
               />

               <View style={styles.divider} />

               <Text style={{ color: theme.colors.text, fontWeight: '500', marginVertical: 8 }}>
                  Your Playlists
               </Text>

               {isLoading ? (
                  <View style={styles.centerContent}>
                     <Text style={{ color: theme.colors.text }}>Loading playlists...</Text>
                  </View>
               ) : playlists.length === 0 ? (
                  <View style={styles.centerContent}>
                     <Text style={{ color: theme.colors.text }}>No playlists found</Text>
                  </View>
               ) : (
                  <FlatList
                     data={playlists}
                     renderItem={renderPlaylistItem}
                     keyExtractor={item => `playlist-${item.id}`}
                     showsVerticalScrollIndicator={false}
                  />
               )}
            </View>
         </Animated.View>
      </Modal>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      borderRadius: 16,
      overflow: 'hidden',
   },
   header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: 'rgba(128,128,128,0.3)',
   },
   closeButton: {
      padding: 4,
      zIndex: 10,
   },
   content: {
      flex: 1,
      padding: 16,
   },
   createButton: {
      padding: 14,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 8,
   },
   playlistItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderRadius: 8,
   },
   disabledItem: {
      opacity: 0.7,
   },
   playlistInfo: {
      flex: 1,
   },
   divider: {
      height: 1,
      backgroundColor: 'rgba(128,128,128,0.2)',
      marginVertical: 16,
   },
   centerContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
});
