import { Context, createContext } from 'react';
import { UseModalProps } from '../hooks/useModal';

export interface ModalContextType extends UseModalProps {
   isVisible: boolean;
   open: () => void;
   close: () => void;
   subscribe?: (cb: (visible: boolean) => void) => () => void;
}

const ModalContext: Context<ModalContextType> = createContext<ModalContextType>({
   height: 180,
   isVisible: false,
   open: () => {},
   close: () => {},
   subscribe: () => () => {},
});

export default ModalContext;
