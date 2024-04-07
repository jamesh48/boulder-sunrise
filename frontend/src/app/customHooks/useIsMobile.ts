import { useState, useEffect } from 'react';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(
          userAgent
        );
      setIsMobile(isMobileDevice);
    }

    handleResize();

    return () => {
      // No need to remove any event listeners in this version
    };
  }, []);

  return isMobile;
}

export default useIsMobile;
