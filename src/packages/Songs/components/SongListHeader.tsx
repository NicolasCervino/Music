import { SeeAll, Text } from '@/components/atoms';
import { View } from 'react-native';

interface SongListHeaderProps {
   ListHeaderComponent?: React.ComponentType<any>;
}

export const SongListHeader = ({ ListHeaderComponent }: SongListHeaderProps) => {
   return (
      <View style={{ paddingHorizontal: 10 }}>
         {ListHeaderComponent && <ListHeaderComponent />}
         <View
            style={{
               flexDirection: 'row',
               justifyContent: 'space-between',
               alignItems: 'center',
               marginBottom: 16,
            }}
         >
            <Text variant="heading">Song List</Text>
            <SeeAll />
         </View>
      </View>
   );
};
