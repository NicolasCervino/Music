import { AlbumDetailView, useAlbumTracks } from '@/src/features/albums';
import { useTheme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

export default function AlbumTracksScreen() {
   const { id } = useLocalSearchParams();
   const router = useRouter();
   const { theme } = useTheme();
   const albumMethods = useAlbumTracks(id as string);

   const goBack = () => router.back();

   return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
         <Stack.Screen
            options={{
               headerShown: true,
               headerShadowVisible: false,
               headerTitle: albumMethods.album?.title || 'Album',
               headerLeft: () => (
                  <Pressable onPress={goBack} style={{ padding: 8, marginRight: 8 }}>
                     <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                  </Pressable>
               ),
            }}
         />
         <AlbumDetailView methods={albumMethods} />
      </View>
   );
}
