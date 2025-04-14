export type ToastType = 'success' | 'error' | 'info';

export interface ToastData {
   message: string;
   type: ToastType;
   duration?: number;
}
