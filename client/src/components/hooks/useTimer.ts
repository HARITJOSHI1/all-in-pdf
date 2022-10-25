import { useContext, useEffect } from 'react';
import { Context } from '../Layout';

export const useTimer = (type: string) => {
  const { setPopup, queue } = useContext(Context)[2];

  useEffect(() => {
    let id: NodeJS.Timeout;
    if (queue?.length) {
      id = setTimeout(() => {
        setPopup(queue?.filter((e) => e.type !== type));
      }, 3000);
    }

    return () => {
      clearTimeout(id);
    };
  }, [queue?.length]);
};
