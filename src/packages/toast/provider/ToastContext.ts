import { createContext } from 'react';
import { ToastData } from '../models';

export interface ToastContextType {
   showToast: (data: ToastData) => void;
   hideToast: () => void;
}

export const ToastContext = createContext<ToastContextType>({
   showToast: () => {},
   hideToast: () => {},
});
