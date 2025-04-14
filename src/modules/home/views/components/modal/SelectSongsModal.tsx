import { AccentButton, Text } from '@/components/atoms';
import { Modal, useModalContext } from '@/components/layout/modal';
import { Track } from '@/entities';
import { usePlaylists } from '@/modules/playlists/hooks';
import { useSongList } from '@/packages/Songs/hooks/useSongList';
import { useTheme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SelectableSong } from '../item/SelectableSong';

interface SelectSongsModalProps {
   playlistData?: { name: string; description: string };
   initialTrackId?: string;
   onSuccess?: () => void;
}

type SelectionMap = Record<string, boolean>;

export function SelectSongsModal({
   playlistData,
   initialTrackId,
   onSuccess,
}: SelectSongsModalProps): React.ReactElement {
   const { theme } = useTheme();
   const { close: closeModal, isVisible } = useModalContext();
   const { create } = usePlaylists();
   const [selectedMap, setSelectedMap] = useState<SelectionMap>(() => {
      return initialTrackId ? { [initialTrackId]: true } : {};
   });

   useEffect(() => {
      if (initialTrackId && isVisible) {
         setSelectedMap({ [initialTrackId]: true });
      }
   }, [initialTrackId, isVisible]);

   useEffect(() => {
      if (!isVisible) {
         const timer = setTimeout(() => {
            if (initialTrackId) {
               setSelectedMap({ [initialTrackId]: true });
            } else {
               setSelectedMap({});
            }
         }, 300);

         return () => clearTimeout(timer);
      }
   }, [isVisible, initialTrackId]);

   const close = useCallback(() => {
      closeModal();
   }, [closeModal]);

   const fadeIn = useRef(new Animated.Value(0)).current;

   useEffect(() => {
      Animated.timing(fadeIn, {
         toValue: 1,
         duration: 250,
         useNativeDriver: true,
      }).start();
   }, []);

   const { songs, isError, pagination } = useSongList();

   const toggleTrackSelection = useCallback((trackId: string) => {
      setSelectedMap(prev => ({
         ...prev,
         [trackId]: !prev[trackId],
      }));
   }, []);

   const selectedTracks = useMemo(() => {
      return Object.entries(selectedMap)
         .filter(([, isSelected]) => isSelected)
         .map(([id]) => id);
   }, [selectedMap]);

   const selectedCount = useMemo(() => selectedTracks.length, [selectedTracks]);

   const handleCreatePlaylist = async () => {
      if (!playlistData) return;

      try {
         const now = Date.now();
         await create.mutateAsync({
            name: playlistData.name,
            description: playlistData.description,
            createdAt: now,
            updatedAt: now,
            trackIds: selectedTracks,
         });

         close();
         onSuccess?.();
      } catch (error) {
         console.error('Error creating playlist:', error);
      }
   };

   const SongItem = useCallback(
      ({ item }: { item: Track }) => {
         const isSelected = !!selectedMap[item.id];

         return (
            <SelectableSong
               onPress={() => toggleTrackSelection(item.id)}
               isSelected={isSelected}
               track={item}
            />
         );
      },
      [selectedMap, toggleTrackSelection]
   );

   return (
      <Modal overlay fullScreen>
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
               <Text
                  variant="heading"
                  style={{
                     color: theme.colors.text,
                     fontSize: 22,
                     fontWeight: '600',
                  }}
               >
                  Select Songs
               </Text>
               <Pressable
                  style={styles.closeButton}
                  onPress={close}
                  hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
               >
                  <Ionicons name="close" size={22} color={theme.colors.text + '99'} />
               </Pressable>
            </View>

            {isError ? (
               <View style={styles.centerContent}>
                  <Text style={{ color: theme.colors.text }}>Error loading songs</Text>
               </View>
            ) : (
               <>
                  <FlatList
                     data={songs}
                     renderItem={SongItem}
                     keyExtractor={item => item.id}
                     onEndReached={pagination.onLoadMore}
                     onEndReachedThreshold={0.5}
                     contentContainerStyle={styles.listContent}
                     showsVerticalScrollIndicator={false}
                     initialNumToRender={8}
                     maxToRenderPerBatch={5}
                     updateCellsBatchingPeriod={50}
                     windowSize={3}
                     removeClippedSubviews={true}
                  />

                  <View style={[styles.footer, { backgroundColor: theme.colors.background }]}>
                     <Text
                        style={{
                           color: theme.colors.text,
                           fontWeight: '500',
                        }}
                     >
                        {selectedCount} song{selectedCount !== 1 ? 's' : ''} selected
                     </Text>
                     <AccentButton
                        title="Create Playlist"
                        onPress={handleCreatePlaylist}
                        disabled={selectedCount === 0}
                        buttonStyle={[
                           styles.createButton,
                           { opacity: selectedCount === 0 ? 0.6 : 1 },
                        ]}
                     />
                  </View>
               </>
            )}
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
      paddingTop: 24,
      paddingBottom: 16,
      marginBottom: 4,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: 'rgba(128,128,128,0.3)',
   },
   closeButton: {
      padding: 4,
      zIndex: 10,
   },
   centerContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
   listContent: {
      paddingBottom: 80,
   },
   footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: 'rgba(128,128,128,0.15)',
      paddingBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
   },
   createButton: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 20,
   },
});
