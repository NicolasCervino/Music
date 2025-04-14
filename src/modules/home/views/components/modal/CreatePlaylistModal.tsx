import { AccentButton, Text } from '@/components/atoms';
import { Modal, useModalContext } from '@/components/layout/modal';
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

export interface CreatePlaylistModalProps {
   onNext: (playlistData: { name: string; description: string; trackId?: string }) => void;
   trackId?: string;
}

const NAME_MAX_LENGTH = 12;
const DESCRIPTION_MAX_LENGTH = 40;
const ERROR_COLOR = '#FF3B30';

export function CreatePlaylistModal({
   onNext,
   trackId,
}: CreatePlaylistModalProps): React.ReactElement {
   const { theme } = useTheme();
   const { close, isVisible } = useModalContext();
   const [playlistName, setPlaylistName] = useState('');
   const [description, setDescription] = useState('');

   const fadeIn = useRef(new Animated.Value(0)).current;

   useEffect(() => {
      Animated.timing(fadeIn, {
         toValue: 1,
         duration: 250,
         useNativeDriver: true,
      }).start();
   }, []);

   useEffect(() => {
      if (!isVisible) {
         const timer = setTimeout(() => {
            setPlaylistName('');
            setDescription('');
         }, 300);

         return () => clearTimeout(timer);
      }
   }, [isVisible]);

   const isNameValid = playlistName.trim().length > 0 && playlistName.length <= NAME_MAX_LENGTH;
   const isDescriptionValid = description.length <= DESCRIPTION_MAX_LENGTH;
   const isFormValid = isNameValid && isDescriptionValid;

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
         onNext({
            ...playlistData,
            trackId,
         });

         close();
      } catch (error) {
         console.error('Error handling playlist:', error);
      }
   };

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
         <View style={{ marginBottom: 16 }}>
            <View
               style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
               }}
            >
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
                  {
                     padding: 12,
                     borderRadius: 8,
                     borderWidth: 1,
                     fontSize: 16,
                     backgroundColor: theme.colors.card,
                     color: theme.colors.text,
                     borderColor: isError ? ERROR_COLOR : 'rgba(128,128,128,0.3)',
                     ...(isMultiline && { minHeight: 100 }),
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
               <Text style={{ color: ERROR_COLOR, fontSize: 12, marginTop: 4 }}>
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
               style={{ flex: 1, justifyContent: 'flex-end' }}
            >
               <Animated.View
                  style={[
                     {
                        padding: 0,
                        flex: 1,
                        borderRadius: 16,
                        overflow: 'hidden',
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
                  <View
                     style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 16,
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: 'rgba(128,128,128,0.3)',
                     }}
                  >
                     <Text variant="heading" style={{ color: theme.colors.text }}>
                        Create Playlist
                     </Text>

                     <Pressable
                        style={{ padding: 4, zIndex: 10 }}
                        onPress={close}
                        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                     >
                        <Ionicons name="close" size={22} color={theme.colors.text + '99'} />
                     </Pressable>
                  </View>

                  <View style={{ padding: 24, flex: 1 }}>
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
                        title={'Next'}
                        onPress={handleAction}
                        disabled={!isFormValid}
                        buttonStyle={{
                           marginTop: 16,
                           padding: 16,
                           borderRadius: 8,
                           alignItems: 'center',
                           justifyContent: 'center',
                           opacity: !isFormValid ? 0.6 : 1,
                        }}
                     />
                  </View>
               </Animated.View>
            </KeyboardAvoidingView>
         </TouchableWithoutFeedback>
      </Modal>
   );
}
