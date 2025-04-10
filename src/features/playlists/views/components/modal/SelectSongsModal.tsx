import { AccentButton, Text } from '@/components/atoms';
import { Modal, useModalContext } from '@/components/layout/modal';
import { Track } from '@/entities';
import { useSongList } from '@/packages/Songs/hooks/useSongList';
import { useTheme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useCreatePlaylist } from '../../../hooks';
import { SelectableSong } from '../item/SelectableSong';

interface SelectSongsModalProps {
   playlistData?: { name: string; description: string };
}

// Faster selection implementation using a plain object instead of Set
type SelectionMap = Record<string, boolean>;

export function SelectSongsModal({ playlistData }: SelectSongsModalProps): React.ReactElement {
   const { theme } = useTheme();
   const { close } = useModalContext();
   const { mutateAsync: createPlaylist } = useCreatePlaylist();
   const [selectedMap, setSelectedMap] = useState<SelectionMap>({});

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
         await createPlaylist({
            name: playlistData.name,
            description: playlistData.description,
            createdAt: now,
            updatedAt: now,
            trackIds: selectedTracks,
         });

         close();
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
         <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
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
               <Pressable onPress={close} style={styles.closeButton}>
                  <Ionicons name="close" size={28} color={theme.colors.text} />
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
                        buttonStyle={styles.createButton}
                     />
                  </View>
               </>
            )}
         </View>
      </Modal>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      paddingTop: 24,
      paddingBottom: 16,
      marginBottom: 4,
   },
   closeButton: {
      padding: 4,
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
   },
   createButton: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 20,
   },
});
