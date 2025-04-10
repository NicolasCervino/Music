import React from 'react';
import { useModal, UseModalProps } from '../hooks/useModal';
import ModalContext from './ModalContext';

interface ModalWrapperProps extends UseModalProps {
   methods?: ReturnType<typeof useModal>;
   children: React.ReactNode | React.ReactNode[];
}

export function ModalWrapper({
   methods,
   children,
   ...props
}: ModalWrapperProps): React.ReactElement<ModalWrapperProps> {
   const defaultMethods = useModal(props);

   return (
      <ModalContext.Provider value={methods ?? defaultMethods}>{children}</ModalContext.Provider>
   );
}
