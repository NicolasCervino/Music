import { MarqueeText } from '@/components/atoms/MarqueeText/MarqueeText';
import { PLAYER_BAR_HEIGHT } from '@/constants/dimensions';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { usePlayer } from '../../../hooks/usePlayer';

type MiniPlayerProps = {
   onPress: () => void;
   backgroundColor: string;
   isReady: boolean;
};

export function MiniPlayer({ onPress, backgroundColor, isReady }: MiniPlayerProps) {
   const { currentTrack, isPlaying, pauseTrack, resumeTrack, nextTrack, previousTrack } =
      usePlayer();

   const handlePlayPause = () => {
      if (isPlaying) {
         pauseTrack();
      } else {
         resumeTrack();
      }
   };

   return (
      <View
         style={[
            styles.container,
            {
               backgroundColor: isReady ? backgroundColor : 'transparent',
               opacity: isReady ? 1 : 0,
            },
         ]}
      >
         <View style={styles.content}>
            <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.songInfo}>
               {currentTrack?.artwork ? (
                  <Image
                     source={{ uri: currentTrack.artwork }}
                     style={styles.artwork}
                     contentFit="cover"
                     transition={200}
                  />
               ) : (
                  <View style={[styles.artwork, styles.placeholderArtwork]}>
                     <Ionicons name="musical-note" size={20} color="white" />
                  </View>
               )}
               <View style={{ flex: 1 }}>
                  <MarqueeText
                     text={currentTrack?.title ?? ''}
                     style={{ width: 150 }}
                     textStyle={styles.title}
                     variant="caption"
                     speed={0.3}
                     spacing={45}
                  />
                  <MarqueeText
                     text={currentTrack?.artist.name ?? ''}
                     style={{ width: 150 }}
                     textStyle={styles.artist}
                     variant="caption"
                     speed={0.3}
                     spacing={45}
                  />
               </View>
            </TouchableOpacity>

            <View style={styles.controls}>
               <TouchableOpacity
                  onPress={e => {
                     e.stopPropagation();
                     previousTrack();
                  }}
                  activeOpacity={0.5}
               >
                  <Ionicons name="play-skip-back" size={24} color="white" />
               </TouchableOpacity>
               <TouchableOpacity
                  onPress={e => {
                     e.stopPropagation();
                     handlePlayPause();
                  }}
                  activeOpacity={0.5}
               >
                  <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color="white" />
               </TouchableOpacity>
               <TouchableOpacity
                  onPress={e => {
                     e.stopPropagation();
                     nextTrack();
                  }}
                  activeOpacity={0.5}
               >
                  <Ionicons name="play-skip-forward" size={24} color="white" />
               </TouchableOpacity>
            </View>
         </View>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      width: '100%',
      height: PLAYER_BAR_HEIGHT,
      borderRadius: 50,
   },
   content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      borderRadius: 50,
   },
   songInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flex: 1,
   },
   artwork: {
      width: 40,
      height: 40,
      borderRadius: 4,
   },
   placeholderArtwork: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
   },
   title: {
      color: '#FFFFFF',
      fontWeight: '500',
   },
   artist: {
      color: '#FFFFFF',
      opacity: 0.8,
   },
   controls: {
      flexDirection: 'row',
      gap: 20,
      alignItems: 'center',
   },
});
