import React, { useRef, useEffect, useState, memo } from 'react';
import { useResponsiveVideo } from '../../hooks/useResponsiveVideo';

export const CinematicVideo: React.FC = memo(() => {
  const { videoSrc } = useResponsiveVideo();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);

  // Maintain stable playback across re-renders
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const currentSrcAttr = video.getAttribute('data-src');
    if (currentSrcAttr !== videoSrc) {
      video.setAttribute('data-src', videoSrc);
      video.src = videoSrc;
      video.load();
      video.play().catch((err) => {
        console.warn('Autoplay prevented or interrupted:', err);
      });
    }
  }, [videoSrc]);

  // Seamless looping without black flash
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    if (video.duration - video.currentTime < 0.15) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  };

  const handleLoadedData = () => {
    setIsVideoLoaded(true);
    setLoadError(false);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleError = () => {
    console.warn(`Could not load cinematic video from ${videoSrc}, using royal navy backdrop.`);
    setLoadError(true);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        zIndex: 0,
        backgroundColor: '#050A14',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      {/* Royal Navy Cinematic Canvas */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, #050A14 0%, #07111F 50%, #050A14 100%)',
          zIndex: 1,
        }}
      />

      {/* Primary Cinematic Video: Preserving Composition with Contain */}
      {!loadError && (
        <video
          ref={videoRef}
          data-testid="cinematic-video"
          playsInline
          muted
          autoPlay
          loop
          preload="auto"
          onLoadedData={handleLoadedData}
          onTimeUpdate={handleTimeUpdate}
          onError={handleError}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            zIndex: 2,
            opacity: isVideoLoaded ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
          }}
        />
      )}
    </div>
  );
});

CinematicVideo.displayName = 'CinematicVideo';
