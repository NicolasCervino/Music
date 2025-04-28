import { Text } from '@/components/atoms';
import React, { Component, Suspense } from 'react';
import { StyleSheet, View } from 'react-native';
import { Delay } from '../delay/Delay';

interface Props {
   children: React.ReactNode;
   fallback?: React.ReactNode;
   errorFallback?: ({
      error,
      resetErrorBoundary,
   }: {
      error: Error;
      resetErrorBoundary: () => void;
   }) => React.ReactNode;
   time?: number;
   delay?: boolean;
   isLoading?: boolean | (undefined | boolean)[];
}

interface State {
   hasError: boolean;
   error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
   constructor(props: Props) {
      super(props);
      this.state = { hasError: false };
   }

   static getDerivedStateFromError(error: Error): State {
      return { hasError: true, error };
   }

   componentDidCatch(error: Error): void {
      console.error('ErrorBoundary caught an error:', error);
      this.setState({ hasError: true, error });
   }

   resetErrorBoundary = (): void => {
      this.setState({ hasError: false, error: undefined });
   };

   render(): React.ReactElement | React.ReactNode {
      const { isLoading, fallback, errorFallback, children, delay, time } = this.props;

      if ([isLoading]?.flat()?.includes(true)) {
         return fallback;
      }

      if (this.state.hasError) {
         if (errorFallback) {
            return errorFallback({
               error: this.state.error!,
               resetErrorBoundary: this.resetErrorBoundary,
            });
         } else if (fallback) {
            return fallback;
         }

         return (
            <View style={styles.errorContainer}>
               <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
               <Text style={styles.errorMessage}>
                  {this.state.error?.message || "We couldn't load this content"}
               </Text>
               <View style={styles.errorButton} onTouchEnd={this.resetErrorBoundary}>
                  <Text style={styles.errorButtonText}>Try Again</Text>
               </View>
            </View>
         );
      }

      return (
         <Suspense fallback={fallback}>
            {delay && time !== 0 ? (
               <Delay time={time ?? 0} fallback={fallback}>
                  {children}
               </Delay>
            ) : (
               children
            )}
         </Suspense>
      );
   }
}

const styles = StyleSheet.create({
   errorContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#121212',
   },
   errorTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#ffffff',
      marginBottom: 12,
   },
   errorMessage: {
      fontSize: 16,
      textAlign: 'center',
      color: '#b3b3b3',
      marginBottom: 24,
   },
   errorButton: {
      backgroundColor: '#4c8bf5',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
   },
   errorButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
   },
});
