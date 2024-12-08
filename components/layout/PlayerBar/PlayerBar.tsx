import { View, Text, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PlayerBar() {
  return (
    <View style={{
      height: 56,
      backgroundColor: '#282828',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      borderRadius: 24,
      margin: 8,
      gap: 12,
    }}>
      {/* Song info */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
        <Image
          source={{ uri: 'https://via.placeholder.com/40' }}
          style={{ width: 36, height: 36, borderRadius: 6 }}
        />
        <View>
          <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '500' }}>
            Moonlights
          </Text>
          <Text style={{ color: '#A7A7A7', fontSize: 12 }}>
            Burbank
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View style={{ flexDirection: 'row', gap: 24, alignItems: 'center' }}>
        <Pressable>
          <Ionicons name="play-skip-back" size={22} color="white" />
        </Pressable>
        <Pressable>
          <Ionicons name="play" size={22} color="white" />
        </Pressable>
        <Pressable>
          <Ionicons name="play-skip-forward" size={22} color="white" />
        </Pressable>
      </View>
    </View>
  );
}