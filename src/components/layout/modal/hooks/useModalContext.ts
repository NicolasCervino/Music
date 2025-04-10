import { useContext } from 'react';
import ModalContext, { ModalContextType } from '../provider/ModalContext';

export const useModalContext = (): ModalContextType => {
   const context = useContext(ModalContext);

   if (!context) {
      throw new Error('useModalContext must be used within a ModalWrapper');
   }

   return context;
};
