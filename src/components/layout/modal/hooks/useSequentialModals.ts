import { useCallback, useRef, useState } from 'react';
import { ModalContextType } from '../provider/ModalContext';

export interface SequentialModalItem {
   modal: ModalContextType;
   condition?: boolean;
}

export interface SequentialModalsParams {
   items: SequentialModalItem[];
}

export type ModalConfig<T = Record<string, unknown>> = {
   name: string;
   props?: T;
};

export type ModalQueueItem<T = Record<string, unknown>> = {
   config: ModalConfig<T>;
   resolve: (value: boolean) => void;
   reject: (reason?: any) => void;
};

type ReturnType = {
   queueModal: <T>(config: ModalConfig<T>) => Promise<boolean>;
   currentModal: ModalConfig | null;
   isVisible: boolean;
   closeModal: (confirmed?: boolean) => void;
};

/**
 * Hook to display modals in sequence
 * @param items - Array of modal items with modal and condition (if condition is true, modal will display)
 * @returns currentIndex - Current index of the modal
 * @returns reset - Function to reset the modal sequence
 */
export const useSequentialModals = (): ReturnType => {
   const [isVisible, setIsVisible] = useState(false);
   const [currentModal, setCurrentModal] = useState<ModalConfig | null>(null);
   const queueRef = useRef<ModalQueueItem[]>([]);
   const currentPromiseRef = useRef<ModalQueueItem | null>(null);

   const processQueue = useCallback(() => {
      if (queueRef.current.length > 0 && !currentPromiseRef.current) {
         const nextItem = queueRef.current.shift() as ModalQueueItem;
         currentPromiseRef.current = nextItem;
         setCurrentModal(nextItem.config);
         setIsVisible(true);
      } else if (queueRef.current.length === 0 && !currentPromiseRef.current) {
         setIsVisible(false);
         setCurrentModal(null);
      }
   }, []);

   const queueModal = useCallback(
      <T>(config: ModalConfig<T>): Promise<boolean> => {
         return new Promise<boolean>((resolve, reject) => {
            queueRef.current.push({
               config,
               resolve,
               reject,
            } as ModalQueueItem);

            processQueue();
         });
      },
      [processQueue]
   );

   const closeModal = useCallback(
      (confirmed = false) => {
         if (currentPromiseRef.current) {
            currentPromiseRef.current.resolve(confirmed);
            currentPromiseRef.current = null;
         }

         setIsVisible(false);
         setTimeout(() => {
            processQueue();
         }, 300);
      },
      [processQueue]
   );

   return {
      queueModal,
      currentModal,
      isVisible,
      closeModal,
   };
};
