import { Text } from '@/components/atoms';
import React, { Component, Suspense } from 'react';
import { Delay } from '../delay/Delay';

interface Props {
   children: React.ReactNode;
   fallback?: React.ReactNode;
   time?: number;
   delay?: boolean;
   isLoading?: boolean | (undefined | boolean)[];
}

interface State {
   hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
   constructor(props: Props) {
      super(props);
      this.state = { hasError: false };
   }

   componentDidCatch(): void {
      this.setState({ hasError: true });
   }

   render(): React.ReactElement | React.ReactNode {
      const { isLoading, fallback, children, delay, time } = this.props;

      if ([isLoading]?.flat()?.includes(true)) {
         return fallback;
      }

      if (this.state.hasError) {
         return <Text>Something went wrong.</Text>;
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