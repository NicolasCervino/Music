export class PermissionError extends Error {
   constructor(message: string) {
      super(message);
      this.name = 'PermissionError';
   }
}

export interface PermissionResult {
   granted: boolean;
   error?: string;
   canAskAgain: boolean;
}
