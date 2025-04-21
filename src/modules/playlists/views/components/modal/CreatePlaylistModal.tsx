import { AccentButton, Text } from '@/components/atoms';
import { Modal, useModalContext } from '@/components/layout/modal';
import { Playlist } from '@/entities';
import { useTheme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
   Animated,
   Keyboard,
   KeyboardAvoidingView,
   Platform,
   Pressable,
   StyleSheet,
   TextInput,
   TouchableWithoutFeedback,
   View,
} from 'react-native';
import { usePlaylists } from '../../../hooks';

export interface CreatePlaylistModalProps {
   onNext?: (playlistData: { name: string; description: string }) => void;
   isEditing?: boolean;
   playlist?: Playlist | null;
}

// Character limits for form fields
const NAME_MAX_LENGTH = 12;
const DESCRIPTION_MAX_LENGTH = 40;
const ERROR_COLOR = '#FF3B30';

export function CreatePlaylistModal({
   onNext,
   isEditing = false,
   playlist,
}: CreatePlaylistModalProps): React.ReactElement {
   const { theme } = useTheme();
   const { close } = useModalContext();
   const [playlistName, setPlaylistName] = useState('');
   const [description, setDescription] = useState('');
   const { create, update } = usePlaylists();

   // Animation value
   const fadeIn = useRef(new Animated.Value(0)).current;

   // Populate form when editing existing playlist
   useEffect(() => {
      if (isEditing && playlist) {
         setPlaylistName(playlist.name);
         setDescription(playlist.description || '');
      }

      Animated.timing(fadeIn, {
         toValue: 1,
         duration: 250,
         useNativeDriver: true,
      }).start();
   }, [isEditing, playlist]);

   // Form validation
   const isNameValid = playlistName.trim().length > 0 && playlistName.length <= NAME_MAX_LENGTH;
   const isDescriptionValid = description.length <= DESCRIPTION_MAX_LENGTH;
   const isFormValid = isNameValid && isDescriptionValid;

   const modalTitle = isEditing ? 'Edit Playlist' : 'Create Playlist';
   const buttonTitle = isEditing ? 'Save Changes' : onNext ? 'Next' : 'Create Playlist';

   // Generic field change handler
   const handleFieldChange = (
      setter: React.Dispatch<React.SetStateAction<string>>,
      value: string,
      maxLength: number,
      buffer = 5
   ) => {
      if (value.length <= maxLength + buffer) {
         setter(value);
      }
   };

   const handleAction = async () => {
      if (!isFormValid) return;

      const playlistData = {
         name: playlistName.trim(),
         description: description.trim(),
      };

      try {
         // For editing an existing playlist
         if (isEditing && playlist) {
            await update.mutateAsync({
               ...playlist,
               ...playlistData,
               updatedAt: Date.now(),
            });
         }
         // For creating a new playlist with song selection
         else if (onNext) {
            onNext(playlistData);
            // Reset state after passing data to the next step
            setPlaylistName('');
            setDescription('');
         }
         // For creating a new empty playlist
         else {
            const now = Date.now();
            await create.mutateAsync({
               ...playlistData,
               createdAt: now,
               updatedAt: now,
               trackIds: [],
            });

            setPlaylistName('');
            setDescription('');
         }

         close();
      } catch (error) {
         console.error('Error handling playlist:', error);
      }
   };

   // Reusable input field component
   const renderField = (
      label: string,
      value: string,
      setter: React.Dispatch<React.SetStateAction<string>>,
      placeholder: string,
      maxLength: number,
      isValid: boolean,
      isMultiline = false
   ) => {
      const isError = value.length > 0 && !isValid;

      return (
         <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
               <Text style={{ color: theme.colors.text }}>{label}</Text>
               <Text
                  style={{
                     color: isError ? ERROR_COLOR : theme.colors.text + '80',
                     fontSize: 12,
                  }}
               >
                  {value.length}/{maxLength}
               </Text>
            </View>
            <TextInput
               style={[
                  styles.input,
                  isMultiline && styles.textArea,
                  {
                     backgroundColor: theme.colors.card,
                     color: theme.colors.text,
                     borderColor: isError ? ERROR_COLOR : 'rgba(128,128,128,0.3)',
                  },
               ]}
               value={value}
               onChangeText={text => handleFieldChange(setter, text, maxLength)}
               placeholder={placeholder}
               placeholderTextColor={theme.colors.text + '80'}
               multiline={isMultiline}
               numberOfLines={isMultiline ? 4 : 1}
               textAlignVertical={isMultiline ? 'top' : 'center'}
               maxLength={maxLength + 5}
            />
            {isError && (
               <Text style={styles.errorText}>
                  {label} must be {maxLength} characters or less
               </Text>
            )}
         </View>
      );
   };

   return (
      <Modal overlay height={460}>
         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
               behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
               style={styles.modalContainer}
            >
               <Animated.View
                  style={[
                     styles.modalContent,
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
                        {modalTitle}
                     </Text>

                     <Pressable
                        style={styles.closeButton}
                        onPress={close}
                        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                     >
                        <Ionicons name="close" size={22} color={theme.colors.text + '99'} />
                     </Pressable>
                  </View>

                  <View style={styles.form}>
                     {renderField(
                        'Playlist Name',
                        playlistName,
                        setPlaylistName,
                        'Enter playlist name',
                        NAME_MAX_LENGTH,
                        isNameValid
                     )}

                     {renderField(
                        'Description (optional)',
                        description,
                        setDescription,
                        'Enter description',
                        DESCRIPTION_MAX_LENGTH,
                        isDescriptionValid,
                        true
                     )}

                     <AccentButton
                        title={buttonTitle}
                        onPress={handleAction}
                        disabled={!isFormValid}
                        buttonStyle={[
                           styles.createButton,
                           {
                              opacity: !isFormValid ? 0.6 : 1,
                           },
                        ]}
                     />
                  </View>
               </Animated.View>
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
   form: {
      padding: 24,
      flex: 1,
   },
   inputContainer: {
      marginBottom: 16,
   },
   labelContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
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
   errorText: {
      color: ERROR_COLOR,
      fontSize: 12,
      marginTop: 4,
   },
});
