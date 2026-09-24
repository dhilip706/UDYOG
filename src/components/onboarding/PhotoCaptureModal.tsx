import React, { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Camera, Upload, Trash2, X, Check } from 'lucide-react';
import { Button } from '../ui/Button';

interface PhotoCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhoto?: string;
  onSavePhoto: (photoDataUrl?: string) => void;
}

export const PhotoCaptureModal: React.FC<PhotoCaptureModalProps> = ({
  isOpen,
  onClose,
  currentPhoto,
  onSavePhoto,
}) => {
  const { t } = useLanguage();
  const [photoPreview, setPhotoPreview] = useState<string | undefined>(currentPhoto);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setPhotoPreview(currentPhoto);
  }, [currentPhoto]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 400 }, height: { ideal: 400 }, facingMode: 'user' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      alert('Camera access is unavailable. Please upload a file instead.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureSnapshot = () => {
    const video = videoRef.current;
    if (!video) return;
    const vWidth = video.videoWidth || 640;
    const vHeight = video.videoHeight || 480;
    const minDim = Math.min(vWidth, vHeight);
    const sx = (vWidth - minDim) / 2;
    const sy = (vHeight - minDim) / 2;

    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, sx, sy, minDim, minDim, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setPhotoPreview(dataUrl);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPhotoPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onSavePhoto(photoPreview);
    stopCamera();
    onClose();
  };

  const handleRemove = () => {
    setPhotoPreview(undefined);
    onSavePhoto(undefined);
    stopCamera();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        background: 'rgba(7, 26, 58, 0.82)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={() => {
        stopCamera();
        onClose();
      }}
    >
      <div
        className="classic-navy-surface"
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '24px',
          textAlign: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
            {t.onboarding.mandatoryPhotoTitle || t.onboarding.takePhoto || 'Profile Photo'}
          </h3>
          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            style={{ color: 'var(--color-text-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Viewfinder or Preview */}
        <div
          style={{
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            margin: '0 auto 20px',
            overflow: 'hidden',
            border: '2px solid rgba(139, 174, 219, 0.4)',
            background: 'rgba(7, 26, 58, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {isCameraActive ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
            />
          ) : photoPreview ? (
            <img
              src={photoPreview}
              alt="Profile"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <Camera size={44} color="var(--color-steel-light)" />
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {isCameraActive ? (
            <Button variant="primary" size="md" onClick={captureSnapshot}>
              <Check size={16} /> Snap Photo
            </Button>
          ) : (
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <Button variant="secondary" size="md" onClick={startCamera}>
                <Camera size={15} /> {t.onboarding.takePhoto}
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={15} /> {t.onboarding.uploadPhoto}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
            </div>
          )}

          {photoPreview && !isCameraActive && (
            <button
              type="button"
              onClick={handleRemove}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '0.8125rem',
                color: 'var(--color-error)',
                marginTop: '4px',
              }}
            >
              <Trash2 size={14} />
              <span>{t.onboarding.removePhoto}</span>
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <Button variant="ghost" size="md" onClick={onClose}>
            {t.onboarding.cancel}
          </Button>
          <Button variant="primary" size="md" onClick={handleSave}>
            {t.onboarding.saveChanges}
          </Button>
        </div>
      </div>
    </div>
  );
};
