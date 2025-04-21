import LottieView from 'lottie-react-native';
import { useColorScheme, View } from 'react-native';

interface SplashScreenProps {
   onFinish?: (isCancelled: boolean) => void;
}

export function SplashScreen({ onFinish = () => {} }: SplashScreenProps) {
   const isDarkMode = useColorScheme() === 'dark';
   const backgroundColor = isDarkMode ? '#0f0f0f' : '#B82838';

   return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor }}>
         <LottieView
            source={require('../../../assets/lotties/splash-animated.json')}
            onAnimationFinish={onFinish}
            autoPlay
            resizeMode="cover"
            colorFilters={[
               ...Array.from({ length: 5 }, (_, i) => ({
                  keypath: `dot${i + 1}`,
                  color: isDarkMode ? '#B82838' : '#000000',
               })),
               ...Array.from({ length: 5 }, (_, i) => ({
                  keypath: `line${i + 1}`,
                  color: isDarkMode ? '#B82838' : '#000000',
               })),
            ]}
            loop={true}
            style={{
               width: 350,
               height: 350,
            }}
         />
      </View>
   );
}
