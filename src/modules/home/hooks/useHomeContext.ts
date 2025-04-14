import { useContext } from 'react';
import { HomeContext, HomeContextType } from '../provider/HomeContext';

export const useHomeContext = (): HomeContextType => {
   const context = useContext(HomeContext);

   if (!context) {
      throw new Error('useHomeContext must be used within a HomeWrapper');
   }

   return context;
};
