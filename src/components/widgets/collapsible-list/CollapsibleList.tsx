import { SeeAll, Text } from '@/components/atoms';
import { ErrorBoundary } from '@/components/layout/error-boundary/ErrorBoundary';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { useCallback, useMemo, useRef, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

interface CollapsibleListProps<T> {
   title: string;
   data: T[];
   renderItem: ListRenderItem<T>;
   keyExtractor: (item: T) => string;
   renderHeader?: () => React.ReactNode;
   initialVisibleCount?: number;
   estimatedItemSize: number;
   isLoading?: boolean;
   fallback?: React.ReactNode;
   onLoadMore?: () => void;
   bottomPadding?: number;
   headerStyle?: StyleProp<ViewStyle>;
   expanded?: boolean;
   onExpandToggle?: () => void;
   numColumns?: number;
}

export function CollapsibleList<T>({
   title,
   data,
   renderItem,
   keyExtractor,
   renderHeader,
   initialVisibleCount = 5,
   estimatedItemSize,
   isLoading = false,
   fallback = <View style={{ height: 300 }} />,
   onLoadMore,
   bottomPadding = 0,
   expanded: externalExpanded,
   onExpandToggle: externalToggle,
   numColumns = 1,
   headerStyle,
}: CollapsibleListProps<T>) {
   const [internalExpanded, setInternalExpanded] = useState(false);
   const expanded = externalExpanded !== undefined ? externalExpanded : internalExpanded;
   const listRef = useRef<FlashList<T>>(null);

   const hasEnoughItems = data.length > initialVisibleCount;

   const displayedItems = useMemo(() => {
      return !hasEnoughItems || expanded ? data : data.slice(0, initialVisibleCount);
   }, [expanded, data, initialVisibleCount, hasEnoughItems]);

   const toggleExpand = useCallback(() => {
      if (externalToggle) {
         externalToggle();
      } else {
         setInternalExpanded(prev => !prev);
      }

      setTimeout(() => {
         if (listRef.current) {
            const targetIndex = !expanded
               ? initialVisibleCount > 0
                  ? initialVisibleCount - 1
                  : 0
               : 0;
            listRef.current.scrollToIndex({ index: targetIndex, animated: true });
         }
      }, 100);
   }, [expanded, initialVisibleCount, externalToggle]);

   return (
      <View style={{ flex: 1, paddingBottom: bottomPadding }}>
         <ErrorBoundary isLoading={isLoading} fallback={fallback}>
            {renderHeader && !expanded && <View style={headerStyle}>{renderHeader()}</View>}
            <View
               style={{
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
               }}
            >
               <Text variant="heading">{title}</Text>
               {hasEnoughItems && <SeeAll onPress={toggleExpand} expanded={expanded} />}
            </View>
            <FlashList
               ref={listRef}
               estimatedItemSize={estimatedItemSize}
               numColumns={numColumns}
               data={displayedItems}
               renderItem={renderItem}
               keyExtractor={keyExtractor}
               onEndReached={expanded ? onLoadMore : undefined}
               onEndReachedThreshold={0.5}
               showsVerticalScrollIndicator={false}
               contentContainerStyle={{ paddingHorizontal: 10 }}
               drawDistance={estimatedItemSize * 10}
               maintainVisibleContentPosition={{
                  minIndexForVisible: 0,
               }}
            />
         </ErrorBoundary>
      </View>
   );
}
