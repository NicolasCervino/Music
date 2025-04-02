import { Text } from '@/components/atoms';
import { useTheme } from '@/theme';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { TrackSkeleton } from './TrackSkeleton';

interface SongListSkeletonProps {
   count?: number;
   ListHeader?: React.ReactNode;
}

export const SongListSkeleton = React.memo(({ count = 8, ListHeader }: SongListSkeletonProps) => {
   const { theme } = useTheme();

   return (
      <View style={{ flex: 1, paddingHorizontal: 10 }}>
         <View style={{ alignItems: 'center', marginVertical: 20, paddingHorizontal: 20 }}>
            <ActivityIndicator
               size="large"
               color={theme.colors.primary}
               style={{ marginBottom: 20 }}
            />
            <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
               This might take a while...
            </Text>
         </View>
         {ListHeader}
         {Array.from({ length: count }).map((_, index) => (
            <TrackSkeleton key={`skeleton-${index}`} />
         ))}
      </View>
   );
});
