import { useEffect, useRef, useState } from 'react';
import { ModalContextType } from '../provider/ModalContext';

export interface UseModalProps {
   isVisible?: boolean;
   onClose?: () => void;
   height?: number;
}

export const useModal = ({ height = 550, onClose, isVisible }: UseModalProps): ModalContextType => {
   const [defaultIsVisible, setIsVisible] = useState(false);
   const subscribers = useRef<Set<(visible: boolean) => void>>(new Set());

   const LOCAL_IS_VISIBLE = isVisible ?? defaultIsVisible;

   const notify = (visible: boolean) => {
      subscribers.current.forEach(cb => cb(visible));
   };

   const open = () => {
      setIsVisible(true);
      notify(true);
   };

   const defaultClose = () => {
      onClose ? onClose() : setIsVisible(false);
      notify(false);
   };

   useEffect(() => {
      if (isVisible !== undefined) {
         notify(isVisible);
      }
   }, [isVisible]);

   const subscribe = (cb: (visible: boolean) => void) => {
      subscribers.current.add(cb);
      return () => {
         subscribers.current.delete(cb);
      };
   };

   return {
      isVisible: LOCAL_IS_VISIBLE,
      height,
      close: defaultClose,
      open,
      subscribe,
   };
};
