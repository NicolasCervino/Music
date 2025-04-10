import { PlaylistDetailView } from '@/src/features/playlists';
import { usePlaylistDetail } from '@/src/features/playlists/hooks/usePlaylistDetail';
import { useTheme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

export default function PlaylistScreen() {
   const { id } = useLocalSearchParams();
   const router = useRouter();
   const { theme } = useTheme();
   const playlistMethods = usePlaylistDetail(id as string);

   const goBack = () => router.back();

   return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
         <Stack.Screen
            options={{
               headerShown: true,
               headerShadowVisible: false,
               headerTitle: playlistMethods.playlist?.name || 'Playlist',
               headerLeft: () => (
                  <Pressable onPress={goBack} style={{ padding: 8, marginRight: 8 }}>
                     <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                  </Pressable>
               ),
            }}
         />
         <PlaylistDetailView methods={playlistMethods} />
      </View>
   );
}
