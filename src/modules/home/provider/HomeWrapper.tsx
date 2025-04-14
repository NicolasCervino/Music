import React from 'react';
import { useHome } from '../hooks/useHome';
import { HomeContext } from './HomeContext';

interface HomeWrapperProps {
   methods?: ReturnType<typeof useHome>;
   children: React.ReactNode | React.ReactNode[];
}

export function HomeWrapper({ methods, children }: HomeWrapperProps): React.ReactElement {
   const defaultMethods = useHome();

   return <HomeContext.Provider value={methods ?? defaultMethods}>{children}</HomeContext.Provider>;
}
