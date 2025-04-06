import { SeeAll, Text } from '@/components/atoms';
import { View } from 'react-native';

interface SongListHeaderProps {
   renderHeader?: () => React.ReactNode;
   onToggleExpand?: () => void;
   expanded?: boolean;
}

export const SongListHeader = ({
   renderHeader,
   expanded = false,
   onToggleExpand,
}: SongListHeaderProps) => {
   return (
      <View style={{ paddingHorizontal: 10 }}>
         {renderHeader && renderHeader()}
         <View
            style={{
               flexDirection: 'row',
               justifyContent: 'space-between',
               alignItems: 'center',
               marginBottom: 16,
            }}
         >
            <Text variant="heading">Song List</Text>
            <SeeAll onPress={onToggleExpand} expanded={expanded} />
         </View>
      </View>
   );
};
