import { Text } from '@/components/atoms';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RepeatMode } from 'react-native-track-player';
import { usePlayer } from '../../../hooks/usePlayer';
import { ProgressSlider } from '../progress-slider/ProgressSlider';

type PlayerViewProps = {
   backgroundColor: string;
   isReady: boolean;
};

export function ExpandedPlayerView({ backgroundColor, isReady }: PlayerViewProps) {
   const {
      currentTrack,
      isPlaying,
      pauseTrack,
      resumeTrack,
      isExpanded,
      nextTrack,
      previousTrack,
      repeatMode,
      toggleRepeatMode,
   } = usePlayer();

   if (!currentTrack) return null;

   return (
      <View
         style={[
            styles.container,
            {
               backgroundColor: isReady ? backgroundColor : 'transparent',
               opacity: isReady ? 1 : 0,
               borderTopLeftRadius: isExpanded ? 0 : 50,
               borderTopRightRadius: isExpanded ? 0 : 50,
            },
         ]}
      >
         <View style={styles.contentContainer}>
            {currentTrack.artwork ? (
               <Image
                  source={{ uri: currentTrack.artwork }}
                  style={styles.artwork}
                  contentFit="cover"
               />
            ) : (
               <View style={[styles.artwork, styles.placeholderArtwork]}>
                  <Ionicons name="musical-note" size={64} color="rgba(255, 255, 255, 0.7)" />
               </View>
            )}

            <View style={styles.songInfo}>
               <Text style={styles.title}>{currentTrack.title}</Text>
               <Text style={styles.artist}>{currentTrack.artist}</Text>
            </View>

            <ProgressSlider />

            <View style={styles.controls}>
               <TouchableOpacity style={styles.controlButton}>
                  <Ionicons name="shuffle" size={24} color="white" />
               </TouchableOpacity>

               <TouchableOpacity style={styles.controlButton} onPress={() => previousTrack()}>
                  <Ionicons name="play-skip-back" size={24} color="white" />
               </TouchableOpacity>

               <TouchableOpacity
                  style={[styles.playButton, styles.controlButton]}
                  onPress={isPlaying ? pauseTrack : resumeTrack}
               >
                  <Ionicons name={isPlaying ? 'pause' : 'play'} size={32} color="black" />
               </TouchableOpacity>

               <TouchableOpacity style={styles.controlButton} onPress={() => nextTrack()}>
                  <Ionicons name="play-skip-forward" size={24} color="white" />
               </TouchableOpacity>

               <TouchableOpacity style={styles.controlButton} onPress={() => toggleRepeatMode()}>
                  <Ionicons
                     name={repeatMode === RepeatMode.Off ? 'repeat' : 'repeat-outline'}
                     size={24}
                     color={repeatMode === RepeatMode.Off ? 'rgba(255, 255, 255, 0.5)' : 'white'}
                  />
               </TouchableOpacity>
            </View>
         </View>
      </View>
   );
}

export const styles = StyleSheet.create({
   container: {
      flex: 1,
      width: '100%',
      padding: 20,
   },
   contentContainer: {
      justifyContent: 'space-evenly',
      flex: 1,
   },
   artwork: {
      width: '100%',
      aspectRatio: 1,
      borderRadius: 8,
      marginVertical: 32,
   },
   placeholderArtwork: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
   },
   songInfo: {
      marginBottom: 32,
   },
   title: {
      fontSize: 24,
      fontWeight: '600',
      color: '#FFFFFF',
      marginBottom: 8,
   },
   artist: {
      fontSize: 18,
      color: '#FFFFFF',
      opacity: 0.8,
   },
   controls: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      position: 'relative',
      zIndex: 2,
      marginTop: 16,
   },
   controlButton: {
      width: 66,
      height: 66,
      justifyContent: 'center',
      alignItems: 'center',
   },
   playButton: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#FFFFFF',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 8,
   },
});
