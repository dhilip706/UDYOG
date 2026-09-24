import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { CinematicVideo } from '../video/CinematicVideo';
import { AtmosphereOverlay } from '../cinematic/AtmosphereOverlay';
import { useLanguage } from '../../hooks/useLanguage';
import { voiceService } from '../../services/voice/voiceService';

interface MandatoryPhotoCaptureScreenProps {
  onPhotoConfirmed: (photoDataUrl: string) => void;
  initialPhoto?: string;
}

export const MandatoryPhotoCaptureScreen: React.FC<MandatoryPhotoCaptureScreenProps> = ({
  onPhotoConfirmed,
  initialPhoto,
}) => {
  const { currentLanguage, t } = useLanguage();
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialPhoto || null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  // Pre-warm VEXYL connection and pre-synthesize first greeting in background while on photo screen
  useEffect(() => {
    voiceService.unlockAudioContext().catch(() => {});
    if (t?.onboarding?.welcomeVoiceGreeting) {
      voiceService.preWarmPrompt(t.onboarding.welcomeVoiceGreeting, currentLanguage).catch(() => {});
    }
  }, [currentLanguage, t]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const isTamil = currentLanguage === 'ta';

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {}
      });
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);
    setIsInitializing(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera is not supported on this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 720 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch {
          // Playback might need explicit trigger
        }
      }

      setIsCameraActive(true);
      setIsInitializing(false);
    } catch (err: any) {
      console.warn('[MandatoryPhotoCapture] Camera error:', err);
      setIsCameraActive(false);
      setIsInitializing(false);
      const isDenied =
        err?.name === 'NotAllowedError' ||
        err?.name === 'PermissionDeniedError' ||
        err?.message?.includes('denied');
      if (isDenied) {
        setCameraError(
          isTamil
            ? 'கேமரா அனுமதி மறுக்கப்பட்டது. பதிவு செய்வதற்கு சுயவிவரப் படம் கட்டாயம். உங்கள் உலாவியில் கேமரா அனுமதியை வழங்கி மீண்டும் முயற்சிக்கவும்.'
            : 'Camera permission was denied. A profile photo is mandatory to verify your identity for job seeker registration. Please enable camera access in your browser settings and try again.'
        );
      } else {
        setCameraError(
          isTamil
            ? 'கேமராவை அணுக முடியவில்லை. சாதனம் கேமராவை ஆதரிக்கிறதா என சரிபார்த்து மீண்டும் முயற்சிக்கவும்.'
            : 'Unable to access camera hardware. Please check that your camera is connected and not in use by another application, then try again.'
        );
      }
    }
  }, [isTamil, stopCamera]);

  useEffect(() => {
    if (!photoPreview) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [photoPreview, startCamera, stopCamera]);

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || !isCameraActive) return;

    try {
      const vWidth = video.videoWidth || 640;
      const vHeight = video.videoHeight || 480;

      // Extract centered square crop so the face is never distorted or squashed
      const minDim = Math.min(vWidth, vHeight);
      const sx = (vWidth - minDim) / 2;
      const sy = (vHeight - minDim) / 2;

      const canvas = document.createElement('canvas');
      canvas.width = 480;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Draw mirrored horizontally so snapshot matches mirror-like camera preview
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, sx, sy, minDim, minDim, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setPhotoPreview(dataUrl);
      stopCamera();
      voiceService.unlockAudioContext().catch(() => {});
    } catch (err) {
      console.error('[MandatoryPhotoCapture] Snapshot error:', err);
    }
  };

  const handleRetake = () => {
    setPhotoPreview(null);
    startCamera();
  };

  const handleConfirm = () => {
    if (!photoPreview) return;
    voiceService.unlockAudioContext().catch(() => {});
    stopCamera();
    onPhotoConfirmed(photoPreview);
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-text-primary)',
        overflowX: 'hidden',
        padding: '24px 16px',
        background:
          'linear-gradient(180deg, rgba(7, 26, 58, 0.85) 0%, rgba(11, 36, 82, 0.8) 50%, rgba(7, 26, 58, 0.95) 100%)',
      }}
    >
      <CinematicVideo />
      <AtmosphereOverlay />

      <main
        className="classic-navy-surface"
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '520px',
          padding: 'clamp(24px, 5vw, 36px)',
          borderRadius: '20px',
          border: '1.5px solid rgba(139, 174, 219, 0.5)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          textAlign: 'center',
          animation: 'classic-fade-in 0.35s ease-out',
        }}
      >
        {/* Step Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '20px',
            background: 'rgba(23, 74, 145, 0.6)',
            border: '1px solid rgba(139, 174, 219, 0.4)',
            fontSize: '0.75rem',
            color: 'var(--color-steel-light)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '14px',
          }}
        >
          <Camera size={13} />
          <span>{isTamil ? 'படி 1: கட்டாய சரிபார்ப்பு' : 'Step 1: Mandatory Identity Verification'}</span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.25rem, 4vw, 1.65rem)',
            fontWeight: 600,
            color: '#FFFFFF',
            margin: '0 0 8px',
            lineHeight: 1.3,
          }}
        >
          {isTamil ? 'சுயவிவரப் படம் எடுக்கவும்' : 'Capture Your Profile Photo'}
        </h1>

        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.45,
            margin: '0 auto 24px',
            maxWidth: '420px',
          }}
        >
          {isTamil
            ? 'அரசு மற்றும் நிறுவனப் பணிகளுக்கான சரிபார்ப்பிற்கு உங்கள் முகம் தெளிவாகத் தெரியும் புகைப்படம் கட்டாயம் தேவை. புகைப்படம் உறுதிசெய்யப்பட்ட பிறகே ஆயிஷா குரல் பதிவு தொடங்கும்.'
            : 'A clear front-facing photograph is mandatory to verify your job seeker identity before starting your voice interview with Aisha.'}
        </p>

        {/* Circular Camera Viewport / Captured Preview */}
        <div
          style={{
            position: 'relative',
            width: 'clamp(220px, 55vw, 280px)',
            height: 'clamp(220px, 55vw, 280px)',
            margin: '0 auto 24px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3.5px solid rgba(139, 174, 219, 0.7)',
            boxShadow: '0 0 32px rgba(23, 74, 145, 0.6), inset 0 0 16px rgba(7, 26, 58, 0.8)',
            background: '#040d1e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {photoPreview ? (
            /* Captured Snapshot */
            <img
              src={photoPreview}
              alt="Captured Beneficiary Profile"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
              }}
            />
          ) : isCameraActive ? (
            /* Live Camera Stream (mirrored horizontally like a mirror) */
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                transform: 'scaleX(-1)',
                display: 'block',
              }}
            />
          ) : (
            /* Loading / Initializing Placeholder */
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-steel-light)' }}>
              {isInitializing ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <RefreshCw size={26} className="spin-animation" style={{ animation: 'spin 1s linear infinite' }} />
                  <span style={{ fontSize: '0.8rem' }}>
                    {isTamil ? 'கேமரா தயாராகிறது...' : 'Connecting to camera...'}
                  </span>
                </div>
              ) : (
                <Camera size={38} color="rgba(139, 174, 219, 0.4)" />
              )}
            </div>
          )}

          {/* Oval Face Guide Overlay when active */}
          {!photoPreview && isCameraActive && (
            <div
              style={{
                position: 'absolute',
                top: '12%',
                left: '20%',
                right: '20%',
                bottom: '12%',
                borderRadius: '50%',
                border: '2px dashed rgba(255, 255, 255, 0.45)',
                pointerEvents: 'none',
              }}
            />
          )}
        </div>

        {/* Camera Permission / Access Error Banner */}
        {cameraError && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              color: '#FCA5A5',
              fontSize: '0.825rem',
              lineHeight: 1.45,
              textAlign: 'left',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start',
              marginBottom: '20px',
            }}
          >
            <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px', color: '#EF4444' }} />
            <div>
              <div style={{ fontWeight: 600, marginBottom: '2px' }}>
                {isTamil ? 'அனுமதி தேவை' : 'Camera Permission Required'}
              </div>
              <div>{cameraError}</div>
              <button
                type="button"
                onClick={startCamera}
                style={{
                  marginTop: '8px',
                  background: 'rgba(239, 68, 68, 0.25)',
                  border: '1px solid rgba(239, 68, 68, 0.6)',
                  color: '#FFFFFF',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <RefreshCw size={13} />
                <span>{isTamil ? 'மீண்டும் முயற்சிக்கவும்' : 'Retry Permission'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Verified Security Notice */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            color: 'var(--color-steel-light)',
            marginBottom: '20px',
          }}
        >
          <ShieldCheck size={14} color="#34D399" />
          <span>
            {isTamil
              ? 'உங்கள் புகைப்படம் பாதுகாப்பாக சேமிக்கப்பட்டு வேலை சரிபார்ப்பிற்கு மட்டுமே பயன்படுத்தப்படும்.'
              : 'Your photo is encrypted and used exclusively for employer qualification verification.'}
          </span>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          {photoPreview ? (
            <>
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={handleRetake}
                leftIcon={<RefreshCw size={16} />}
                style={{ flex: 1 }}
              >
                {isTamil ? 'மீண்டும் எடுக்க' : 'Retake Photo'}
              </Button>

              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={handleConfirm}
                leftIcon={<CheckCircle2 size={18} />}
                style={{
                  flex: 2,
                  background: 'linear-gradient(135deg, #174A91 0%, #1D4ED8 100%)',
                  boxShadow: '0 4px 18px rgba(23, 74, 145, 0.45)',
                  fontWeight: 600,
                }}
              >
                {isTamil ? 'உறுதிசெய்து தொடரவும்' : 'Confirm & Start Aisha'}
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={capturePhoto}
              disabled={!isCameraActive}
              leftIcon={<Camera size={18} />}
              style={{
                width: '100%',
                background: isCameraActive
                  ? 'linear-gradient(135deg, #174A91 0%, #1D4ED8 100%)'
                  : 'rgba(23, 74, 145, 0.4)',
                boxShadow: isCameraActive ? '0 4px 18px rgba(23, 74, 145, 0.45)' : 'none',
                fontWeight: 600,
              }}
            >
              {isTamil ? 'புகைப்படம் எடுக்கவும்' : 'Capture Photo'}
            </Button>
          )}
        </div>
      </main>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
