import { useEffect, useState } from 'react';

export const Delay: React.FC<{
   time: number;
   children?: React.ReactNode;
   fallback: React.ReactNode;
}> = ({ time, children, fallback }) => {
   const [shouldRender, setShouldRender] = useState(false);

   useEffect(() => {
      const timer = setTimeout(() => {
         setShouldRender(true);
      }, time);

      return () => clearTimeout(timer);
   }, [time]);

   return shouldRender ? children : fallback;
};