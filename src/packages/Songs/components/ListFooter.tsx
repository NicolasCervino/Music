import { Text } from '@/components/atoms';
import { memo } from 'react';
import { ActivityIndicator, View } from 'react-native';

interface ListFooterProps {
   isLoadingMore: boolean;
   hasMore: boolean;
   songsLength: number;
}

export const ListFooter = memo(({ isLoadingMore, hasMore, songsLength }: ListFooterProps) => {
   if (isLoadingMore) {
      return (
         <View
            style={{
               padding: 16,
               alignItems: 'center',
               flexDirection: 'row',
               justifyContent: 'center',
            }}
         >
            <ActivityIndicator size="small" style={{ marginRight: 8 }} />
            <Text>Loading more songs...</Text>
         </View>
      );
   }
   return null;
});
