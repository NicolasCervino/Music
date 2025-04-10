import { useTheme } from '@/theme';
import React from 'react';
import {
   Modal as NativeModal,
   ModalProps as NativeModalProps,
   StyleSheet,
   TouchableWithoutFeedback,
   View,
   ViewStyle,
} from 'react-native';
import { useModalContext } from '../hooks/useModalContext';

const styles = StyleSheet.create({
   overlay: {
      flex: 1,
      justifyContent: 'flex-end',
   },
   dismissibleArea: {
      flex: 1,
   },
   sheet: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      position: 'relative',
      overflow: 'hidden',
      zIndex: 1000,
   },
   fullScreen: {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
   },
});

type Props = Omit<NativeModalProps, 'visible' | 'onRequestClose'> & {
   children?: React.ReactNode;
   height?: number;
   overlay?: boolean;
   fullScreen?: boolean;
   style?: ViewStyle;
};

export const Modal: React.FC<Props> = ({
   children,
   style,
   height,
   animationType = 'slide',
   overlay = false,
   fullScreen = false,
   ...props
}) => {
   const { theme } = useTheme();
   const { isVisible, close, height: defaultHeight } = useModalContext();

   const HEIGHT = fullScreen ? '100%' : height ?? defaultHeight;

   return (
      <NativeModal
         animationType={animationType}
         transparent
         visible={isVisible}
         onRequestClose={close}
         {...props}
      >
         {!fullScreen && (
            <TouchableWithoutFeedback onPress={close}>
               <View
                  style={[
                     styles.dismissibleArea,
                     overlay && { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
                  ]}
               />
            </TouchableWithoutFeedback>
         )}
         <View
            style={[
               styles.sheet,
               fullScreen && styles.fullScreen,
               {
                  boxShadow: '0px -4px 8px rgba(0, 0, 0, 0.1)',
                  maxHeight: HEIGHT,
                  height: '100%',
                  backgroundColor: theme.colors.background,
               },
               style,
            ]}
         >
            {children}
         </View>
      </NativeModal>
   );
};
