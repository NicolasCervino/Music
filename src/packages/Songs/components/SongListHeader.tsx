import { ShufflePlay, Text } from '@/components/atoms';
import { View } from 'react-native';

interface SongListHeaderProps {
   renderHeader?: () => React.ReactNode;
   onShufflePlay?: () => void;
   songsAvailable?: boolean;
}

export const SongListHeader = ({
   renderHeader,
   onShufflePlay,
   songsAvailable = false,
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
            <ShufflePlay onPress={onShufflePlay} disabled={!songsAvailable} />
         </View>
      </View>
   );
};
