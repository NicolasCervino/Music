import { AccentButton, Text } from '@/components/atoms';
import { Modal, useModalContext } from '@/components/layout/modal';
import { useTheme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
   Keyboard,
   KeyboardAvoidingView,
   Platform,
   Pressable,
   StyleSheet,
   TextInput,
   TouchableWithoutFeedback,
   View,
} from 'react-native';
import { useCreatePlaylist } from '../../../hooks';

interface CreatePlaylistModalProps {
   onNext?: (playlistData: { name: string; description: string }) => void;
}

export function CreatePlaylistModal({ onNext }: CreatePlaylistModalProps): React.ReactElement {
   const { theme } = useTheme();
   const { close } = useModalContext();
   const [playlistName, setPlaylistName] = useState('');
   const [description, setDescription] = useState('');
   const { mutateAsync: createPlaylist } = useCreatePlaylist();

   const isCreateDisabled = !playlistName.trim();

   const onListCreate = async () => {
      if (isCreateDisabled) return;
      if (onNext) {
         close();
         onNext({
            name: playlistName.trim(),
            description: description.trim(),
         });
         return;
      }

      try {
         const now = Date.now();
         await createPlaylist({
            name: playlistName.trim(),
            description: description.trim(),
            createdAt: now,
            updatedAt: now,
            trackIds: [],
         });

         setPlaylistName('');
         setDescription('');
         close();
      } catch (error) {
         console.error('Error creating playlist:', error);
      }
   };

   return (
      <Modal overlay height={460}>
         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
               behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
               style={styles.modalContainer}
            >
               <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
                  <View style={styles.header}>
                     <Text variant="heading" style={{ color: theme.colors.text }}>
                        Create Playlist
                     </Text>
                     <Pressable onPress={close} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color={theme.colors.text} />
                     </Pressable>
                  </View>

                  <View style={styles.form}>
                     <View style={styles.inputContainer}>
                        <Text style={{ color: theme.colors.text, marginBottom: 8 }}>
                           Playlist Name
                        </Text>
                        <TextInput
                           style={[
                              styles.input,
                              {
                                 backgroundColor: theme.colors.card,
                                 color: theme.colors.text,
                                 borderColor: 'rgba(128,128,128,0.3)',
                              },
                           ]}
                           value={playlistName}
                           onChangeText={setPlaylistName}
                           placeholder="Enter playlist name"
                           placeholderTextColor={theme.colors.text + '80'}
                        />
                     </View>

                     <View style={styles.inputContainer}>
                        <Text style={{ color: theme.colors.text, marginBottom: 8 }}>
                           Description (optional)
                        </Text>
                        <TextInput
                           style={[
                              styles.input,
                              styles.textArea,
                              {
                                 backgroundColor: theme.colors.card,
                                 color: theme.colors.text,
                                 borderColor: 'rgba(128,128,128,0.3)',
                              },
                           ]}
                           value={description}
                           onChangeText={setDescription}
                           placeholder="Enter description"
                           placeholderTextColor={theme.colors.text + '80'}
                           multiline
                           numberOfLines={4}
                           textAlignVertical="top"
                        />
                     </View>

                     <AccentButton
                        title={onNext ? 'Next' : 'Create Playlist'}
                        onPress={onListCreate}
                        disabled={isCreateDisabled}
                        buttonStyle={styles.createButton}
                     />
                  </View>
               </View>
            </KeyboardAvoidingView>
         </TouchableWithoutFeedback>
      </Modal>
   );
}

const styles = StyleSheet.create({
   modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
   },
   modalContent: {
      padding: 0,
      flex: 1,
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
   },
   form: {
      padding: 16,
   },
   inputContainer: {
      marginBottom: 16,
   },
   input: {
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      fontSize: 16,
   },
   textArea: {
      minHeight: 100,
   },
   createButton: {
      marginTop: 16,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
   },
});
