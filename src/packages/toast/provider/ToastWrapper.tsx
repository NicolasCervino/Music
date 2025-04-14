import React from 'react';
import { Toast } from '../components';
import { useToast } from '../hooks/useToast';
import { ToastContext } from './ToastContext';

export const ToastWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   const { visible, toastData, fadeAnim, showToast, hideToast } = useToast();

   return (
      <ToastContext.Provider value={{ showToast, hideToast }}>
         {children}
         {visible && (
            <Toast message={toastData.message} type={toastData.type} fadeAnim={fadeAnim} />
         )}
      </ToastContext.Provider>
   );
};
