import { Text } from '@/components/atoms';
import { useTheme } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, View } from 'react-native';

interface FloatingButtonProps {
   onPress: () => void;
   isExpanded?: boolean;
}

export const FloatingButton = ({ onPress, isExpanded = false }: FloatingButtonProps) => {
   const { theme } = useTheme();

   return (
      <View style={{ position: 'absolute', zIndex: 100, bottom: 82, alignSelf: 'center' }}>
         <Pressable
            style={[
               {
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderRadius: 30,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                  backgroundColor: theme.colors.card,
               },
               isExpanded ? { padding: 14 } : { paddingHorizontal: 20, paddingVertical: 12 },
            ]}
            onPress={onPress}
         >
            <Ionicons name="add" size={isExpanded ? 24 : 22} color={theme.colors.text} />
            {!isExpanded && (
               <Text style={{ marginLeft: 8, fontWeight: 'bold', color: theme.colors.text }}>
                  New Playlist
               </Text>
            )}
         </Pressable>
      </View>
   );
};
