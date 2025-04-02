import { Text } from '@/components/atoms';
import { Image } from 'expo-image';
import { memo } from 'react';
import { Pressable } from 'react-native';
import { Album } from '../types';

interface AlbumCardProps {
   album: Album;
   width?: number;
   height?: number;
}

export const AlbumCard = memo(({ album, width = 150, height = 150 }: AlbumCardProps) => (
   <Pressable style={{ width, marginRight: 16 }}>
      <Image
         source={{ uri: album.artwork }}
         style={{
            width,
            height,
            borderRadius: 8,
            marginBottom: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
         }}
         contentFit="cover"
         cachePolicy="memory-disk"
         transition={200}
      />
      <Text variant="subtitle" style={{ marginBottom: 4 }}>
         {album.title}
      </Text>
      <Text variant="caption" style={{ opacity: 0.7 }}>
         {album.artist}
      </Text>
   </Pressable>
));
