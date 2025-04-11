import { ArtistDetailView } from '@/modules/artists/views/ArtistDetailView';
import { useArtistSongs } from '@/src/modules/artists';
import { useTheme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

export default function ArtistSongsScreen() {
   const { id } = useLocalSearchParams();
   const router = useRouter();
   const { theme } = useTheme();
   const artistMethods = useArtistSongs(id as string);

   const goBack = () => router.back();

   return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
         <Stack.Screen
            options={{
               headerShown: true,
               headerShadowVisible: false,
               headerTitle: artistMethods.artist?.name || 'Artist',
               headerLeft: () => (
                  <Pressable onPress={goBack} style={{ padding: 8, marginRight: 8 }}>
                     <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                  </Pressable>
               ),
            }}
         />
         <ArtistDetailView methods={artistMethods} />
      </View>
   );
}
