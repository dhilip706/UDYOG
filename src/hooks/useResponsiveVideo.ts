import { useState, useEffect } from 'react';

export function useResponsiveVideo() {
  const [videoSrc, setVideoSrc] = useState<string>(() => {
    if (typeof window === 'undefined') return '/laptop.mp4';
    // Mobile portrait: viewport width < 768px and portrait orientation
    const isMobile = window.innerWidth < 768 && window.innerHeight >= window.innerWidth;
    return isMobile ? '/mobile.mp4' : '/laptop.mp4';
  });

  useEffect(() => {
    const checkOrientation = () => {
      const isMobile = window.innerWidth < 768 && window.innerHeight >= window.innerWidth;
      const nextSrc = isMobile ? '/mobile.mp4' : '/laptop.mp4';
      setVideoSrc((prev) => (prev !== nextSrc ? nextSrc : prev));
    };

    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  return {
    videoSrc,
    isMobile: videoSrc === '/mobile.mp4',
  };
}
