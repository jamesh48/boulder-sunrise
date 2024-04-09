import { useState, useEffect } from 'react';

const useIsSSR = () => {
  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    setIsSSR(false); // Assume we're on the client side by default

    return () => {
      setIsSSR(true); // Reset to SSR mode when component unmounts
    };
  }, []); // Only run this effect once on component mount

  return isSSR;
};

export default useIsSSR;
