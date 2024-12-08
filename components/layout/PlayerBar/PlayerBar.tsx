import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/atoms';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useImageColor } from '@/packages/Images/hooks/useImageColor';

export default function PlayerBar() {
  const imageUrl = 'https://cdn-images.dzcdn.net/images/cover/6501bd06032fbd397bc1ad06233f5392/500x500-000000-80-0-0.jpg';
  const { backgroundColor, onLoad } = useImageColor(imageUrl);

  return (
    <View style={{
      height: 68,
      backgroundColor,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      borderRadius: 50,
      gap: 8,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    }}>
      {/* Song info */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
        <Image
          source={imageUrl}
          style={{ width: 32, height: 32, borderRadius: 4 }}
          contentFit="cover"
          onLoad={onLoad}
        />
        <View>
          <Text variant="caption" style={{ color: '#FFFFFF', fontWeight: '500' }}>
            Moonlights
          </Text>
          <Text variant="caption" style={{ color: '#FFFFFF' }}>
            Burbank
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
        <TouchableOpacity>
          <Ionicons name="play-skip-back" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="play" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="play-skip-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}